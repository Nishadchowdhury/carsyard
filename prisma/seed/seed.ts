import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("test done");
}

main().catch((e) => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
})
