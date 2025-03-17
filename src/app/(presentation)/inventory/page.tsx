import ClassifiedList from "@/components/inventory/ClassifiedList";
import { AwaitedPageProps, Favorites, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { getSourceId } from "../../../lib/sourceId";
import { redis } from "../../../lib/redisStore";


const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
    return prisma.classified.findMany({
        include: {
            images: true,
        }
    })
}


const page: React.FC<PageProps> = async (props) => {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = prisma.classified.count();

    const sourceId = await getSourceId(); // gets the sourceId from the cookies.
    const favorites = await redis.get<Favorites>(sourceId ?? ""); // gets the favorites from the redis session.

    return <>
        <ClassifiedList classifieds={classifieds} favorites={favorites ? favorites.ids : []} />
    </>
}

export default page;