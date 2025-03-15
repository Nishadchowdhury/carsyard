import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function makeClient() {
    return new PrismaClient({ log: ["error", "info", "warn"] });
}


export const prisma = globalForPrisma.prisma || makeClient();


prisma.$use(async (params, next) => {
    const before = Date.now();  // Record start time
    const result = await next(params);  // Execute the query
    const after = Date.now();  // Record end time

    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

    return result;  // Return the query result
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
