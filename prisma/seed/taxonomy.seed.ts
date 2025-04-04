import type { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "csv";
import fs from "node:fs";


type Row = {
    make: string,
    model: string,
    variant: string | undefined,
    yearStart: number,
    yearEnd: number
}



type MakeModelMap = {
    [make: string]: {
        [model: string]: {
            variants: {
                [variant: string]: {
                    yearStart: number,
                    yearEnd: number
                }
            }
        }
    }
}

const BATCH_SIZE = 100;

export async function seedTaxonomy(prisma: PrismaClient) {
    const rows = await new Promise<Row[]>((resolve, reject) => { // in promise, need to pass the type of the data that we are returning

        const eachRow: Row[] = [];

        fs.createReadStream("taxonomy.csv")
            .pipe(parse({ columns: true }))
            .on("data", (row: { [index: string]: string }) => {
                eachRow.push({
                    make: row.Make,
                    model: row.Model,
                    variant: row.Model_Variant || undefined,
                    yearStart: Number(row.Year_Start),
                    yearEnd: row.Year_End
                        ? Number(row.Year_End)
                        : new Date().getFullYear(),
                });
            })
            .on("error", (error) => {
                console.log({ error });
                reject(error);
            })
            .on("end", () => {
                resolve(eachRow);
            });
    })





    // lets inert into the database through a for loop.
    const result: MakeModelMap = {}

    for (const row of rows) { // data objects creator loop

        if (!result[row.make]) { // checking is there anything as toyota: {} 
            result[row.make] = {} // if not like toyota: {} then create toyota: {make: toyota}
        }
        if (!result[row.make][row.model]) {
            /* 
            First Check:
            ✔️ Does the parent object (result[row.make]) exist?
            If not, create it.
            Second Check:
            ✔️ Does the child object (result[row.make][row.model]) exist inside the parent?
            If not, create it.
            */
            result[row.make][row.model] = { // {toyota: {camry: {variants: {}}}
                variants: {}
            }
        }

        if (row.variant) {
            result[row.make][row.model].variants[row.variant] = {
                yearStart: row.yearStart,
                yearEnd: row.yearEnd
            }
        }

    }


    // return console.log(Object.entries(result["AC"]["MAMBA"].variants));

    // time to upsert into the database
    const makePromises = Object.entries(result).map(
        //Object.entries converts the result object into an array of key-value pairs. [['toyota', {make: toyota}]]
        ([name]) => { // .map(([name]) => { ... }), the [name] part is destructuring the inner arrays.
            /* The inner arrays look like: ['apple', 10], ['banana', 20], etc.
            [name] means: "Extract only the first element (key) from each pair." name is the variable name here.
            for both [name, value]
            */

            return prisma.make.upsert({ // Upsert = Update + Insert 
                /* 
                An upsert is a database operation that either inserts a new record if it doesn’t exist or updates the existing one if it does.
                It combines the functionality of both INSERT and UPDATE into a single, efficient action.
                Without upsert, you need separate logic for checking existence, inserting, or updating. Upsert simplifies this into one clean operation.
                Prevents race conditions where two operations might try to insert the same data at the same time. 
                Instead of: Check if the record exists. Insert if it doesn’t. Update if it does. Upsert does it all in one call. 
                */
                where: {
                    name
                },
                update: {
                    name,
                    image: `https://vl.imgix.net/img/${name.replace(/\s+/g, '-').toLowerCase()}-logo.png?auto=format,compress`,
                },
                create: {
                    name,
                    image: `https://vl.imgix.net/img/${name.replace(/\s+/g, '-').toLowerCase()}-logo.png?auto=format,compress`,
                }
            })

        })

    const makes = await Promise.all(makePromises); // there will be multiple promises, so we need to wait for all of them to resolve.
    console.log(`seeded ${makes.length} makes 🌱`);



    // seeding models. Prepare modelPromises Array
    // Purpose: Creates an array to store promises for each upsert operation for models.
    // Prisma.Prisma__ModelClient<unknown, unknown>[] specifies that the array will contain Prisma client promises related to the Model table
    //
    const modelPromises: Prisma.Prisma__ModelClient<unknown, unknown>[] = []; // 
    // Prisma__ModelClient is a TypeScript type auto-generated by Prisma based on your schema.
    // It represents a promise-like object returned by Prisma client methods, such as .findMany(), .create(), .upsert(), etc.

    // Generics: <unknown, unknown> — What Do They Mean? 
    // Prisma__ModelClient is a generic type that takes two type parameters.
    // In this case, the developer used <unknown, unknown> as placeholders for these parameters.

    // Let’s decode what these mean:
    // (First unknown): Represents the shape of the data returned when the promise resolves. By using unknown, the developer is saying: “I don’t want to specify the exact type right now; let TypeScript infer it later.”
    // (Second unknown): Specifies how to handle null values for fields that can be null. Setting it as unknown acts as a generic placeholder, allowing TypeScript to infer it dynamically.
    // the developer is saying: “I don’t care about the exact type now; just collect all these promises.”



    // Step 2: Create Upsert Promises for Each Model
    for (const make of makes) {
        for (const model in result[make.name]) {
            modelPromises.push( // Push to modelPromises: Stores each upsert operation as a promise in modelPromises.
                prisma.model.upsert({
                    where: {
                        makeId_name: { // unique constraint : I wrote in taxonomy.prisma in "model" model @@unique([makeId, name])
                            // This line creates a composite unique constraint based on makeId and name.
                            // It ensures that no two rows can have the same combination of makeId and name.
                            // Prisma generates an implicit name for this unique constraint, which we can access in our code.
                            // How is makeId_name Valid? When you define a unique constraint in Prisma without explicitly naming it, Prisma automatically generates a name for it.

                            // why can't is use where: {makeId: make.id, name: model}? 
                            // Prisma’s .upsert() method requires a unique identifier in the where clause to find an existing record.
                            // name and makeId separately are not unique fields in your model. but in combined it is. Prisma can’t use multiple non-unique fields in the where clause directly. and this time I do not have the id of the model but the name and makeId we we can use it as a unique identifier but need to combine them in model.

                            // if I could the name unique in prisma schema model then I could only the name here to upsert()

                            makeId: make.id,
                            name: model
                        }
                    },
                    update: {
                        name: model,
                    },
                    create: {
                        name: model,
                        make: {
                            connect: { id: make.id } //Find an existing record in the Make table where the id matches make.id. make.id is likely a variable in your code holding the ID of the Make record you want to connect to.

                            // This line is used in Prisma when you're creating or updating a record that has a relationship with another table.
                            // Model has a relation with Make through the makeId field. The make key is a relation field defined in Prisma schema
                            // make: This is the relation field in the Model schema that links to the Make table. It allows to connect a Model record to an existing Make record.
                            // It’s like telling Prisma: “Hey, I don’t want to create a new Make! I just want to connect to an existing one that has this specific id.”
                        }
                    }
                })
            )
        }
    }



    // This function is used to insert data in batches.
    async function insertInBatches<TUpsertArgs>( // this is a generic function TUpsertArgs a generic type parameter.
        items: TUpsertArgs[],
        BATCH_SIZE: number, // amount of items to insert in one go 
        insertFunction: (batch: TUpsertArgs[]) => void // prisma upsert function
    ) {
        for (let i = 0; i < items.length; i += BATCH_SIZE) { // the for loop defined by the length and increase by BATCH_SIZE
            const batch = items.slice(i, i + BATCH_SIZE); // takes the total items and slice it into batches as BATCH_SIZE.  eg: i = 10 BATCH_SIZE = 5 then batch = [10, 11, 12, 13, 14];  
            await insertFunction(batch); // then we process the batch 
        }
    }
    // calling this function
    await insertInBatches<Prisma.Prisma__ModelClient<unknown, unknown>>(
        modelPromises,
        BATCH_SIZE,
        async (batch) => {
            const models = await Promise.all(batch); // this is a promise all function that takes an array of promises and returns an array of results.
            console.log(`Seeded batch of ${models.length} models 🌱`);
        }
    )


    // seeding variants promises array
    const variantPromises: Prisma.Prisma__ModelVariantClient<unknown, unknown>[] = [];

    for (const make of makes) {
        const models = await prisma.model.findMany({
            where: { makeId: make.id }
        }); // getting the models with foreign key makeId

        for (const model of models) {

            if (!result[make.name][model.name]?.variants) {
                continue;
            } else {

                // if (Object.entries(result[make.name][model.name].variants,)) {
                for (const [variant, year_range] of Object.entries( // Each entry in the array is a [key, value] pair. key= variantName, value = {yearStart: number, yearEnd: number} 
                    result[make.name][model.name].variants,
                )) { // checking 'mane.name' exists in result object and '[model.name].variants' exists in that particular result object and the variant is not undefined.
                    variantPromises.push(prisma.modelVariant.upsert({
                        where: {
                            modelId_name: {
                                name: variant,
                                modelId: model.id,
                            }
                        },
                        update: {
                            name: variant,
                        },
                        create: {
                            name: variant,
                            yearStart: year_range.yearStart,
                            yearEnd: year_range.yearEnd,
                            model: {
                                connect: { id: model.id }
                            },
                        }
                    })
                    )
                }
            }
        }
    }


    await insertInBatches<Prisma.Prisma__ModelVariantClient<unknown, unknown>>(
        variantPromises,
        BATCH_SIZE,
        async (batch) => {
            const variants = await Promise.all(batch);
            console.log(`Seeded batch of ${variants.length} variants 🌱`);
        },
    );


}