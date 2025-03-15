import { faker } from "@faker-js/faker";
import { BodyType, ClassifiedStatus, Color, CurrencyCode, FuelType, OdoUnit, Prisma, PrismaClient, Transmission, ULEZCompliance } from "@prisma/client";
import slugify from "slugify";


function getRandomArrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array) // Selecting a random make from the fetched makes.
}

export const classifiedSeed = async (prisma: PrismaClient) => { // Defining an async function to seed classified data.
    const makes = await prisma.make.findMany({ // Fetching all car makes from the database.
        include: {
            models: { // Including models related to each make.
                include: {
                    modelVariants: true // Including model variants for each model of the make.
                }
            },
        }
    });


    const classifiedData: Prisma.ClassifiedCreateManyInput[] = []; // Creating an empty array to store classified data objects.

    for (let i = 0; i < 25; i++) { // Loop to create 25 classified records.

        // all the orations will be done for a single iteration to create a single classified record_object.
        const make = getRandomArrayElement(makes); // Selecting a random make from the fetched makes.

        if (!make.models.length) continue // If the selected make has no models, skip this iteration..

        const model = getRandomArrayElement(make.models); // Selecting a random model from the make.
        const variant = model.modelVariants.length ? getRandomArrayElement(model.modelVariants) : null; // Selecting a random variant if available.

        const year = faker.date.between({ // Generating a random year between 1925 and the current year.
            from: new Date(1925, 0, 1),
            to: new Date()
        }).getFullYear();

        const title = [year, make.name, model.name, variant?.name].filter(Boolean).join(' '); // Creating a title string using the year, make, model, and variant.
        // [2020, "Toyota", "Corolla", undefined].filter(Boolean); // Output: [2020, "Toyota", "Corolla"] // .join() // Output: "2020 Toyota Corolla"

        const vrm = faker.vehicle.vrm(); // Generating a random Vehicle Registration Mark (VRM).

        const baseSlug = slugify(`${title}-${vrm}`); // Creating a slug from title and VRM.       

        classifiedData.push({ // Pushing the generated data object into the array.
            year,
            vrm,
            slug: baseSlug,
            makeId: make.id,
            modelId: model.id,
            ...(variant?.id && { modelVariantId: variant.id }), // Conditionally adding modelVariantId if it exists or nothing.
            title,
            price: faker.number.int({ min: 400000, max: 10000000 }), // Generating a random price between 400,000 and 10,000,000.
            odoReading: faker.number.int({ min: 0, max: 200000 }), // Generating a random odometer reading.
            doors: faker.number.int({ min: 2, max: 8 }), // Generating a random number of doors.
            seats: faker.number.int({ min: 2, max: 8 }), // Generating a random number of seats.
            views: faker.number.int({ min: 100, max: 10000 }), // Generating a random number of views.
            description: faker.commerce.productDescription(), // Generating a random description.
            currency: getRandomArrayElement(Object.values(CurrencyCode)), // Selecting a random currency code.
            odoUnit: getRandomArrayElement(Object.values(OdoUnit)), // Selecting a random odometer unit.
            bodyType: getRandomArrayElement(Object.values(BodyType)), // Selecting a random body type.
            transmission: getRandomArrayElement(Object.values(Transmission)), // Selecting a random transmission type.
            fuelType: getRandomArrayElement(Object.values(FuelType)), // Selecting a random fuel type.
            color: getRandomArrayElement(Object.values(Color)), // Selecting a random color.
            ulezCompliance: getRandomArrayElement(Object.values(ULEZCompliance)), // Selecting a random ULEZ compliance status.
            status: getRandomArrayElement(Object.values(ClassifiedStatus)), // Selecting a random classified status.
        })
    }

    const result = await prisma.classified.createMany({ // Inserting generated data into the database.
        data: classifiedData,
        skipDuplicates: true // Preventing errors caused by duplicate slugs.
        // why it will check slug is unique or not: Prisma automatically checks unique constraints in the database schema to determine what counts as a duplicate. In your Classified model (from classified.prisma), the slug field is marked as @unique:
    })

    console.log(`Total of ${result.count} classifieds seeded.`); // Logging the total number of records inserted.
    
}
