import { Prisma, PrismaClient } from "@prisma/client";
import { imageSources } from "../../src/config/constants";
import { faker } from "@faker-js/faker";
import { createPngDataUri } from "unlazy/thumbhash";//Creates a PNG data URI from a Thumbhash string.

export async function seedImages(prisma: PrismaClient) {
    const classifieds = await prisma.classified.findMany()

    const classifiedIds = classifieds.map((classified) => classified.id)

    for (const classifiedId of classifiedIds) {
        const image: Prisma.ImageCreateInput = {
            src: imageSources.classifiedPlaceholder,
            alt: faker.lorem.words(3),
            classified: { connect: { id: classifiedId } },
            blurHash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
        }

        await prisma.image.create({ data: image })
    }


}
