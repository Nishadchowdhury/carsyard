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


const PageSchema = z.string().transform((val) => Math.max(Number(val), 1)).optional();
//  z.string() → Expects the input to be a string.
// .transform((val) => Math.max(Number(val), 1)) // transform used to convert any to any other type.
// Converts the string to a number using Number(val).
// .optional() → Makes the field optional.

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
    const validPage = PageSchema.parse(searchParams?.page);

    //get current page  
    const page = validPage ? validPage : 1;

    const offset = (page - 1) * CLASSIFIED_PER_PAGE; // this will get the offset of the page. such as if the page is 1, the offset will be 0. if the page is 2, the offset will be 3. if the page is 3, the offset will be 6. this is used to skip the number of classifieds to be retrieved from the database.

    return prisma.classified.findMany({
        where: {},
        include: { images: { take: 1 }, },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    })
}


const page: React.FC<PageProps> = async (props) => {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count({ where: {} });

    const sourceId = await getSourceId(); // gets the sourceId from the cookies.
    const favorites = await redis.get<Favorites>(sourceId ?? ""); // gets the favorites from the redis session.

    const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE); //(25 / 3) = Math.ceil(8.333333333333334) returns 9 pages.

    return <div className="flex ">
        <SideBar
            minMaxValues={null}
            searchParams={searchParams}
        /> {/*were using sidebar in page instead of layout cz we need search params and in layout we can't access search params after being changed from client side*/}

        <div className="flex-1 p-4 bg-white">

            <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1 ">

                <div className="flex justify-between items-center w-full">
                    <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit" >
                        We have found <span className="text-primary" >{count}</span> classifieds...
                    </h2>

                    {/* <DialogFilters /> */}
                </div>
                <CustomPagination
                    baseUrl={routes.inventory}
                    totalPages={totalPages}

                    styles={{
                        paginationRoot: "flex justify-end",
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