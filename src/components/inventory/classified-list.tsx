import { classifiedWithImages } from "@/config/types";
import ClassifiedCard from "./classified-card";

interface pageProps {
    classifieds: classifiedWithImages[]
}
const ClassifiedList: React.FC<pageProps> = (props) => {

    const classifieds = props.classifieds;


    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ' >
            {classifieds.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
            ))}

        </div>
    )

}

export default ClassifiedList;