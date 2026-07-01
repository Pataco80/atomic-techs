import { Prisma } from "@/generated/prisma";

/**
 * Coerces a value (typically TipTap JSON from a form) into something Prisma
 * accepts for a nullable `Json?` column: a pure, serialisable JSON value, or
 * `DbNull` to clear the column when the value is null/undefined.
 *
 * The JSON round-trip is deliberate: values arriving through a React Server
 * Action can carry non-plain references (proxies / client references) that
 * Prisma's internal Decimal check chokes on ("Cannot access toStringTag on the
 * server"). Round-tripping guarantees a plain object before Prisma sees it.
 *
 * Server-only — importing this pulls in the Prisma runtime.
 */
export function toJsonInput(value: unknown) {
  if (value == null) return Prisma.DbNull;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
