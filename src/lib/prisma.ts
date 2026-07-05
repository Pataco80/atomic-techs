import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

/**
 * Make `sslmode` explicit as `verify-full`.
 *
 * `pg` (>= 8.16) warns that the SSL modes `prefer`, `require` and `verify-ca`
 * are treated as aliases for `verify-full`, and that this will change in a
 * future major version. Since our connection already resolves to `verify-full`
 * (and connects successfully), we pin it explicitly to keep the exact current
 * behavior and silence the deprecation warning.
 */
const normalizeSslMode = (url: string): string =>
  url.replace(/([?&]sslmode=)(prefer|require|verify-ca)\b/i, "$1verify-full");

const connectionString = normalizeSslMode(`${process.env.DATABASE_URL}`);

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
