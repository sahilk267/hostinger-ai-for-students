/**
 * Read-only schema inspection for the two Phase 11 optional security tables.
 * Uses INFORMATION_SCHEMA SELECT only, never creates/updates/deletes any data.
 */
import mysql from "mysql2/promise";
import { validateStagingHttpTarget } from "./phase11-stage-http.mjs";

const required = {
  authSessions: {
    tokenHash: ["varchar",64,"NO"],
    userId: ["int",null,"NO"],
    expiresAt: ["timestamp",null,"NO"],
    revokedAt: ["timestamp",null,"YES"],
    createdAt: ["timestamp",null,"NO"],
  },
  authRequestBuckets: {
    bucketKey: ["varchar",64,"NO"],
    hits: ["int",null,"NO"],
    expiresAt: ["timestamp",null,"NO"],
    createdAt: ["timestamp",null,"NO"],
  },
};

function mysqlTarget(env) {
  if (env.DATABASE_URL) {
    try {
      const parsed = new URL(env.DATABASE_URL);
      if (!["mysql:","mysql2:"].includes(parsed.protocol) || !parsed.hostname ||
        !parsed.username || !parsed.pathname.slice(1)) return null;
      const database=decodeURIComponent(parsed.pathname.slice(1));
      const user=decodeURIComponent(parsed.username);
      return { database,user,connection:env.DATABASE_URL };
    } catch { return null; }
  }
  const database=env.DATABASE_NAME;
  const user=env.DATABASE_USER;
  if (!database || !user || !env.DATABASE_HOST || !env.DATABASE_PASSWORD) return null;
  const port=env.DATABASE_PORT ? Number(env.DATABASE_PORT) : 3306;
  if (!Number.isInteger(port) || port<1 || port>65535) return null;
  return { database,user,connection:{
    host:env.DATABASE_HOST,port,user,password:env.DATABASE_PASSWORD,database,
  }};
}

export function validateReadOnlySchemaTarget(env) {
  const issues=[...validateStagingHttpTarget(env).issues];
  if (env.STAGING_DATA_MODE !== "isolated-db") issues.push("ISOLATED_STAGING_DB_REQUIRED");
  const target=mysqlTarget(env);
  if (!target) issues.push("STAGING_DB_CONFIG_INVALID");
  if (!env.PRODUCTION_DATABASE_NAME || !env.PRODUCTION_DATABASE_USER) {
    issues.push("PRODUCTION_DB_BASELINE_MISSING");
  } else if (target) {
    if (target.database === env.PRODUCTION_DATABASE_NAME) issues.push("DATABASE_NAME_NOT_ISOLATED");
    if (target.user === env.PRODUCTION_DATABASE_USER) issues.push("DATABASE_USER_NOT_ISOLATED");
  }
  return { ok:issues.length===0, issues };
}

export function assessPhase11SecuritySchema(columns,primary,foreign) {
  const issues=[];
  for (const [table,schema] of Object.entries(required)) {
    const actual=columns.filter(row=>row.tableName===table);
    const expectedColumns=Object.entries(schema);
    if (!expectedColumns.every(([name,[kind,length,nullable]])=>{
      const col=actual.find(row=>row.columnName===name);
      return Boolean(col && col.dataType===kind && col.isNullable===nullable
        && (length===null || Number(col.maxLength)===length));
    })) issues.push(table==="authSessions"?"SESSION_COLUMNS_INVALID":"ABUSE_COLUMNS_INVALID");
  }
  for (const [table,column,code] of [
    ["authSessions","tokenHash","SESSION_PRIMARY_KEY_INVALID"],
    ["authRequestBuckets","bucketKey","ABUSE_PRIMARY_KEY_INVALID"],
  ]) {
    if (!primary.some(row=>row.tableName===table&&row.columnName===column)) issues.push(code);
  }
  if (!foreign.some(row=>row.tableName==="authSessions"&&row.columnName==="userId"&&
    row.refTable==="users"&&row.refColumn==="id"&&row.deleteRule==="CASCADE")) {
    issues.push("SESSION_ACCOUNT_CASCADE_MISSING");
  }
  return { ok:issues.length===0, issues };
}

export async function inspectPhase11StagingSchema(env) {
  const gate=validateReadOnlySchemaTarget(env);
  if (!gate.ok) return gate;
  const target=mysqlTarget(env);
  let connection;
  try {
    connection=await mysql.createConnection(target.connection);
    const [columns]=await connection.execute(
      "SELECT TABLE_NAME AS tableName,COLUMN_NAME AS columnName,DATA_TYPE AS dataType,"+
      " CHARACTER_MAXIMUM_LENGTH AS maxLength,IS_NULLABLE AS isNullable "+
      "FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() "+
      "AND TABLE_NAME IN ('authSessions','authRequestBuckets')"
    );
    const [primary]=await connection.execute(
      "SELECT TABLE_NAME AS tableName,COLUMN_NAME AS columnName "+
      "FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE "+
      "WHERE TABLE_SCHEMA=DATABASE() AND CONSTRAINT_NAME='PRIMARY' "+
      "AND TABLE_NAME IN ('authSessions','authRequestBuckets')"
    );
    const [foreign]=await connection.execute(
      "SELECT k.TABLE_NAME AS tableName,k.COLUMN_NAME AS columnName,"+
      "k.REFERENCED_TABLE_NAME AS refTable,k.REFERENCED_COLUMN_NAME AS refColumn,"+
      "r.DELETE_RULE AS deleteRule FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE k "+
      "JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS r "+
      "ON k.CONSTRAINT_SCHEMA=r.CONSTRAINT_SCHEMA "+
      "AND k.CONSTRAINT_NAME=r.CONSTRAINT_NAME "+
      "AND k.TABLE_NAME=r.TABLE_NAME "+
      "WHERE k.TABLE_SCHEMA=DATABASE() AND k.TABLE_NAME='authSessions'"
    );
    return assessPhase11SecuritySchema(columns,primary,foreign);
  } catch {
    // No connection details or provider exception messages are emitted.
    return { ok:false, issues:["READ_ONLY_SCHEMA_INSPECTION_FAILED"] };
  } finally {
    if(connection) await connection.end().catch(()=>undefined);
  }
}
