import { Prisma } from "@/generated/prisma";

/**
 * Coerces a value (typically TipTap JSON from a form) into something Prisma
 * accepts for a nullable `Json?` column: the JSON value itself, or `DbNull`
 * to clear the column when the value is null/undefined.
 *
 * Server-only — importing this pulls in the Prisma runtime.
 */
export function toJsonInput(value: unknown) {
  if (value == null) return Prisma.DbNull;
  return value as Prisma.InputJsonValue;
}
