import { COOKIE_NAME } from "@shared/const";
import { ONE_YEAR_MS } from "@shared/const";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { deleteLearningProgressForUser, deleteUserAccount, getLearningProgressForUser, mergeGuestProgressForUser, saveLearningProgress } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import { invokeLLM } from "./_core/llm";
import { sendAuthenticationCode, sendContactMessage } from "./mail";
import { AUTH_EMAIL_CODE_COOKIE, canRequestEmailCode, clearEmailCodeChallenge, createEmailCodeChallenge, getEmailChallengeCookie, localEmailOpenId, normalizeEmail, verifyEmailCode } from "./authEmail";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().trim().min(1).max(100),
      replyEmail: z.string().email().max(320),
      subject: z.string().trim().min(1).max(160),
      message: z.string().trim().min(1).max(4000),
    })).mutation(async ({ input }) => {
      try {
        await sendContactMessage(input);
        return { success: true as const };
      } catch {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Contact delivery is temporarily unavailable" });
      }
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    requestEmailCode: publicProcedure.input(z.object({ email: z.string().email().max(320) })).mutation(async ({ ctx, input }) => {
      if (!canRequestEmailCode(input.email)) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before requesting another code" });
      const challenge = createEmailCodeChallenge(input.email, ctx.res);
      await sendAuthenticationCode({ to: input.email, code: challenge.code, expiresInMinutes: challenge.expiresInMinutes });
      return { success: true as const, expiresInMinutes: challenge.expiresInMinutes };
    }),
    verifyEmailCode: publicProcedure.input(z.object({ email: z.string().email().max(320), code: z.string().regex(/^\d{6}$/) })).mutation(async ({ ctx, input }) => {
      const email = normalizeEmail(input.email);
      const verified = verifyEmailCode(email, input.code, getEmailChallengeCookie(ctx.req));
      if (!verified) return { success: false as const };

      const openId = localEmailOpenId(email);
      await db.upsertUser({ openId, email, name: email.split("@")[0] || null, loginMethod: "email-otp", lastSignedIn: new Date() });
      const user = await db.getUserByOpenId(openId);
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Account could not be loaded" });

      const sessionToken = await sdk.createSessionToken(openId, { name: user.name || email, expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      clearEmailCodeChallenge(ctx.res);
      return { success: true as const };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return {
        success: true,
      } as const;
    }),
  }),
  explorer: router({
    profiles: protectedProcedure.query(({ ctx }) => db.listExplorerProfilesForUser(ctx.user.id)),
    attempts: protectedProcedure.query(({ ctx }) => db.listExplorerAttemptsForUser(ctx.user.id)),
    createProfile: protectedProcedure.input(z.object({
      displayName: z.string().trim().min(1).max(80),
      ageBand: z.enum(["5-7", "8-10", "11-13", "14-17"]),
      language: z.string().trim().min(2).max(32).default("en"),
      consentVersion: z.literal("explorer-consent-v1"),
    })).mutation(({ ctx, input }) => db.createExplorerProfile({ userId: ctx.user.id, ...input })),
    saveAttempt: protectedProcedure.input(z.object({
      profileId: z.number().int().positive(),
      missionId: z.string().trim().min(1).max(80),
      attemptNumber: z.number().int().min(1).max(20),
      difficulty: z.enum(["supported", "standard", "stretch"]),
      language: z.string().trim().min(2).max(32).default("en"),
      accessibilityMode: z.string().trim().min(1).max(64).default("standard"),
      evidenceJson: z.string().min(1).max(12000),
      observationJson: z.string().min(1).max(4000),
      startedAt: z.date(),
    })).mutation(({ ctx, input }) => db.saveExplorerAttempt({ userId: ctx.user.id, ...input })),
    deleteProfile: protectedProcedure.input(z.object({ profileId: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.softDeleteExplorerProfile(ctx.user.id, input.profileId); return { success: true as const }; }),
    createShare: protectedProcedure.input(z.object({ profileId: z.number().int().positive(), completedCount: z.number().int().min(3).max(24), skills: z.array(z.enum(["planning", "evidence", "creativity", "explanation", "flexibility", "reflection"])).min(1).max(3), expiresInDays: z.union([z.literal(1), z.literal(7), z.literal(30)]).default(7) })).mutation(({ ctx, input }) => db.createExplorerShare({ userId: ctx.user.id, profileId: input.profileId, summaryJson: JSON.stringify({ completedCount: input.completedCount, skills: input.skills }), expiresAt: new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000) })),
    revokeShare: protectedProcedure.input(z.object({ shareId: z.number().int().positive() })).mutation(({ ctx, input }) => db.revokeExplorerShare(ctx.user.id, input.shareId)),
    getShare: publicProcedure.input(z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{32,80}$/) })).query(({ input }) => db.getExplorerShareByToken(input.token)),
    feedback: protectedProcedure.input(z.object({
      ageBand: z.enum(["5-7", "8-10", "11-13", "14-17"]),
      skill: z.enum(["planning", "evidence", "creativity", "explanation", "flexibility", "reflection"]),
      objective: z.string().trim().min(1).max(500),
      rubric: z.array(z.string().trim().min(1).max(180)).min(3).max(5),
      evidenceJson: z.string().trim().min(1).max(6000),
    })).mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a cautious learning coach. Return JSON only. Comment on the submitted practice evidence, not the child as a person. Never diagnose, score IQ, infer personality/disability/mental health, rank children, or predict a career. Use age-appropriate language. Say when the evidence is too limited. Recommend one small next experiment and one reflection question. Do not repeat private details from the evidence." },
            { role: "user", content: JSON.stringify({ ageBand: input.ageBand, skill: input.skill, objective: input.objective, rubric: input.rubric, evidence: input.evidenceJson }) },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "explorer_practice_feedback",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  encouragement: { type: "string", maxLength: 280 },
                  nextExperiment: { type: "string", maxLength: 280 },
                  reflectionQuestion: { type: "string", maxLength: 220 },
                  limitation: { type: "string", maxLength: 220 },
                },
                required: ["encouragement", "nextExperiment", "reflectionQuestion", "limitation"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = response.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new Error("Feedback response was empty");
        const parsed = JSON.parse(content) as Record<string, unknown>;
        return {
          encouragement: String(parsed.encouragement || "You showed your thinking in the evidence you shared."),
          nextExperiment: String(parsed.nextExperiment || "Try the same skill in a new situation."),
          reflectionQuestion: String(parsed.reflectionQuestion || "What would you keep or change next time?"),
          limitation: String(parsed.limitation || "This is feedback on one practice attempt, not a label or prediction."),
        };
      } catch {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "AI feedback is temporarily unavailable; your saved practice feedback remains available." });
      }
    }),
  }),
  learning: router({
    list: protectedProcedure.query(({ ctx }) => getLearningProgressForUser(ctx.user.id)),
    save: protectedProcedure.input(z.object({
      gameId: z.string().min(1).max(64), attempts: z.number().int().min(0), completions: z.number().int().min(0), bestScore: z.number().int().min(0), lastScore: z.number().int().min(0), lastPlayedAt: z.date().nullable().optional(),
    })).mutation(({ ctx, input }) => saveLearningProgress({ userId: ctx.user.id, ...input })),
    syncGuest: protectedProcedure.input(z.object({
      rows: z.array(z.object({ gameId: z.string().min(1).max(64), attempts: z.number().int().min(0), completions: z.number().int().min(0), bestScore: z.number().int().min(0), lastScore: z.number().int().min(0) })).max(10),
    })).mutation(async ({ ctx, input }) => { for (const row of input.rows) await mergeGuestProgressForUser(ctx.user.id, row); return { success: true as const }; }),
    reset: protectedProcedure.mutation(({ ctx }) => deleteLearningProgressForUser(ctx.user.id).then(() => ({ success: true as const }))),
    export: protectedProcedure.query(async ({ ctx }) => ({ user: { name: ctx.user.name, email: ctx.user.email }, progress: await getLearningProgressForUser(ctx.user.id) })),
    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => { await deleteUserAccount(ctx.user.id); return { success: true as const }; }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
