import { classifiedWithImages, Favorites } from "@/config/types";
import ClassifiedCard from "./ClassifiedCard";

interface pageProps {
    classifieds: classifiedWithImages[];
    favorites: number[];

}
const ClassifiedList: React.FC<pageProps> = (props) => {

    const { classifieds, favorites } = props;

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ' >
            {classifieds.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} favorites={favorites} />
            ))}

        </div>
    )

}

export default ClassifiedList;