# Hostinger runtime evidence

- The user screenshot shows the current Hostinger deployment is marked Completed and is running commit `e18cd0ac` from `sahilk267/hostinger-ai-for-students`.
- The live application still returns `Account could not be loaded` after a valid OTP, with `POST /api/trpc/auth.verifyEmailCode?batch=1` returning HTTP 500.
- Navigating to the Hostinger deployment-details URL from the screenshot redirected to the Hostinger login page in the connected browser, so runtime logs and environment variables could not be inspected.
- The decisive error is `TypeError: Invalid URL` from mysql2 `ConnectionConfig.parseUrl` while `drizzle()` creates the connection. This occurs before `upsertUser` or `getUserByOpenId` can execute SQL, so the current failure is a malformed connection string, not yet a users-table schema mismatch.
- The repository schema expects a MySQL URL in the form `mysql://USER:PASSWORD@HOST:3306/DATABASE`; a bare value such as `127.0.0.1:3306` is invalid for mysql2.
- No credentials, OTP values or private learner data were recorded here.
