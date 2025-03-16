import ClassifiedList from "@/components/inventory/classified-list";
import { AwaitedPageProps, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";


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
    


    return <>
        <ClassifiedList classifieds={classifieds} />
    </>
}

export default page;