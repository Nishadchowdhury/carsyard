## the process to seeding the taxonomy database.

### What is Taxonomy in General?

    Taxonomy is the science of classification, where things are organized into hierarchical structures based on their characteristics or relationships.

### What is Taxonomy in this context?

    In this context, taxonomy refers to the structured classification of car-related data. It organizes the relationships between makes (brands), models, and variants into a hierarchy.



    total 5 steps here,

    1. create the csv file's stream and contract a objects and store into an array.
    2. create an object of all data and map the array of data to make the the root object "result".
    3. root object:- that stores all the company names as string keys : {}
        1. the object is be created with the help of a for loop and some conditional checks.
        2.  If the car brand (make) doesn't exist, create it as an empty object {}.
        3. if not "uniqueName"."uniqueModelName" then assign an object with a key { variants: {} }
        4. then check if the row_OBJ has a variant if has then insert the variant in "uniqueName"."uniqueModelName".variants.           "uniqueVariantName" with an object {  yearStart: row.yearStart, yearEnd: row.yearEnd }
        !!! for eg an object is been created in the rows index 2 with "uniqueName": "Toyota" and go thought all the next steps and the rows index 117 is with same "uniqueName": "Toyota" but model is different then the model_obj will be placed in the same "uniqueName" key's key.
        !!! as same for multiple variant with the same name and model then an object will be places in "uniqueName"."uniqueModelName".variants."newVariantName" here.

    2. create promises array with all the names of the brands with prisma upsert then call all the promises through Promise.all() that will add all the make table data to the database.
    3. create an array with the type of prisma upsert promise type. And loop_of through the makes and loop_in all the result object to destructure the model objs then push a upsert promises of upserting the models.
    3.2 each promise created with a unique identifier "makeId_name" instead an id, beside keeping the connection with make table.
    3.3 create a function that will handle a limited batch of promises. The function is designed to process an array of promises in batches, ensuring that a large number of database operations (e.g., inserts) don’t overwhelm the system. the number of promises will be as then BATCH_SIZE variable.
    4. the same way create an array of promises up upsert the variants and fetch the promises with the function of limit.
