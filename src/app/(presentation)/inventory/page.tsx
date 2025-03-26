import ClassifiedList from "@/components/inventory/ClassifiedList";
import CustomPagination from "@/components/shared/CustomPagination";
import { AwaitedPageProps, Favorites, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { routes } from "@/config/routes";
import { redis } from "@/lib/redisStore";
import { getSourceId } from "@/lib/sourceId";
import { z } from "zod";
import { CLASSIFIED_PER_PAGE } from "../../../config/constants";
import SideBar from "../../../components/inventory/SideBar";
import { ClassifiedStatus, Prisma } from "@prisma/client";
import DialogFilters from "../../../components/inventory/DialogFilters";


const PageSchema = z.string().transform((val) => Math.max(Number(val), 1)).optional();
//  z.string() → Expects the input to be a string.
// .transform((val) => Math.max(Number(val), 1)) // transform used to convert any to any other type.
// Converts the string to a number using Number(val).
// .optional() → Makes the field optional.

const ClassifiedFilterSchema = z.object({
    q: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    modelVariant: z.string().optional(),
    minYear: z.string().optional(),
    maxYear: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minReading: z.string().optional(),
    maxReading: z.string().optional(),
    currency: z.string().optional(),
    odoUnit: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: z.string().optional(),
    bodyType: z.string().optional(),
    color: z.string().optional(),
    doors: z.string().optional(),
    seats: z.string().optional(),
    ulezCompliance: z.string().optional(),
})

// this function dynamically constructs an object to pass in "where" while querying in prisma, read more /docs/search and filter.txt
const buildClassifiedFilterQuery = (searchParams: AwaitedPageProps["searchParams"] | undefined): Prisma.ClassifiedWhereInput => {
    // Prisma.ClassifiedWhereInput ensures that this function returns a valid filter object for Prisma. that can be passed in where:'s value.
    const { data } = ClassifiedFilterSchema.safeParse(searchParams);

    console.log({ data, searchParams });
    if (!data) return { status: ClassifiedStatus.LIVE };

    const keys = Object.keys(data);


    const taxonomyFilter = ["make", "model", "modelVariant"];
    const enumFilters = ["odoUnit", "currency", "transmission", "bodyType", "fuelType", "color", "ulezCompliance"];
    const numFilters = ["seats", 'doors',];
    const rangeFilters = { // this for range filters
        minYear: "year", maxYear: "year",
        minPrice: "price", maxPrice: "price",
        minReading: "odoReading", maxReading: "odoReading",
    }



    // Build the filter object with the extracted keys and their corresponding values
    const mapParamsToFields = keys.reduce((acc, key, _i, _arr) => { //Loops through each key in searchParams 

        const value = searchParams?.[key] as string | undefined;
        if (!value) return acc; // Skip if value is undefined // weather {} or   key = { id: Number(value) } 

        if (taxonomyFilter.includes(key)) { // only taxonomyFilter array is allowed to provide the is as stringified number.
            // console.log(acc[key] = { id: Number(value) })
            acc[key] = { id: Number(value) } // writing the aky and the value to the acc as acc[key]_key of the object_ = {id: Number}
        } else if (enumFilters.includes(key)) {
            acc[key] = value.toUpperCase();
        } else if (numFilters.includes(key)) {
            acc[key] = Number(value);

        } else if (key in rangeFilters) { // this checks the key exist or not in the rangeFilters object
            const field = rangeFilters[key as keyof typeof rangeFilters] // Retrieves the corresponding database field name from rangeFilters.

            acc[field] = acc[field] || {};  //Initializing the object for the field if not already set
            // acc = {}; 
            // acc["year"] = acc["year"] || {}; // Ensures acc["year"] is an object before adding conditions.

            if (key.startsWith('min')) { //Setting filter conditions based on prefix (min or max)
                acc[field].gte = Number(value); // Greater than (>=) or equal filter this object will be like  
            } else if (key.startsWith('max')) { // 
                acc[field].lte = Number(value); // Less than (>=) or equal filter 
            }
        }
        return acc;

    }, {} as { [key: string]: any })

    return {
        status: ClassifiedStatus.LIVE,

        ...(searchParams?.q && { //  Full-Text Search (q parameter) 
            OR: [
                {
                    title: {
                        contains: searchParams.q as string,
                        mode: "insensitive" // we do not care about capital later's here.
                    }
                },
                {

                    description: {
                        contains: searchParams.q as string,
                        mode: "insensitive" // we do not care about capital later's here.
                    }
                }

            ]
        }),
        ...mapParamsToFields
    }


}



const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
    const validPage = PageSchema.parse(searchParams?.page);

    //get current page  
    const page = validPage ? validPage : 1;

    const offset = (page - 1) * CLASSIFIED_PER_PAGE; // this will get the offset of the page. such as if the page is 1, the offset will be 0. if the page is 2, the offset will be 3. if the page is 3, the offset will be 6. this is used to skip the number of classifieds to be retrieved from the database.

    return prisma.classified.findMany({
        where: buildClassifiedFilterQuery(searchParams),
        include: { images: { take: 1 }, },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    })
}


const page: React.FC<PageProps> = async (props) => {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count({ where: buildClassifiedFilterQuery(searchParams) });
    const minMaxResult = await prisma.classified.aggregate({
        where: { status: ClassifiedStatus.LIVE },
        _min: {
            year: true,
            price: true,
            odoReading: true
        },
        _max: {
            year: true,
            price: true,
            odoReading: true
        }
    })

    const sourceId = await getSourceId(); // gets the sourceId from the cookies.
    const favorites = await redis.get<Favorites>(sourceId ?? ""); // gets the favorites from the redis session.

    const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE); //(25 / 3) = Math.ceil(8.333333333333334) returns 9 pages.


    return <div className="flex ">
        <SideBar
            minMaxValues={minMaxResult}
            searchParams={searchParams}
        /> {/*were using sidebar in page instead of layout cz we need search params and in layout we can't access search params after being changed from client side*/}

        <div className="flex-1 p-4 bg-white">

            <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1 ">

                <div className="flex justify-between items-center w-full">
                    <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit" >
                        We have found <span className="text-primary" >{count}</span> classifieds...
                    </h2>

                    <DialogFilters
                        count={count}
                        minMaxValues={minMaxResult}
                        searchParams={searchParams}
                    // params={}
                    />
                </div>
                <CustomPagination
                    baseUrl={routes.inventory}
                    totalPages={totalPages}

                    styles={{
                        paginationRoot: "flex justify-end hidden lg:block ",
                        paginationPrev: "",
                        paginationNext: "",
                        paginationLink: "border-none scale-80",
                        paginationLinkActive: "shadow-xl scale-100",
                    }}
                />
                <ClassifiedList
                    classifieds={classifieds}
                    favorites={favorites ? favorites.ids : []}
                />
            </div>
        </div>
    </div>
}

export default page;