import { PrismaClient } from '@prisma/client'
import { seedTaxonomy } from './taxonomy.seed';
import { classifiedSeed } from './classified.seed';
import { seedImages } from './images.seed';

const prisma = new PrismaClient()

async function main() {

    // await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE`; // this command is used to truncate/delete the table and restart the identity column. CASCADE is used to delete the table and all the data in it.
    // with prisma.$executeRaw we can execute raw sql queries.
    // await seedTaxonomy(prisma);

    // await prisma.$executeRaw`TRUNCATE TABLE "classifieds" RESTART IDENTITY CASCADE`;
    // await classifiedSeed(prisma);


    await seedImages(prisma)

}

main().catch((e) => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
})
