import { HeartIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { api } from "../../lib/apiClient";
import { endpoints } from "../../config/endpoints";

interface pageProps {
    isFavorite: boolean;
    setIsFavorite: (isFavorite: boolean) => void;
    classifiedId: number;
}
const FavoriteButton: React.FC<pageProps> = (props) => {

    const { isFavorite, setIsFavorite, classifiedId } = props;

    const router = useRouter();

    const handleFavorite = async () => {
        const { ids } = await api.post<{ ids: number[] }>(endpoints.favorites, { json: { id: classifiedId } });
        // ✅ Why use ky?
        // 
        // json: { id: classifiedId } automatically converts the object to a JSON string.
        // No need to manually set headers like "Content-Type": "application/json".
        // Handles errors better than fetch().


        // to catch the error must use try catch.

        if (ids.includes(classifiedId)) {
            setIsFavorite(true);
        } else {
            setIsFavorite(false);
        }
        setTimeout(() => router.refresh(), 250);
    }

    return <Button
        variant='ghost'
        size='icon'
        className={cn('absolute top-2.5 left-3.5 rounded-full z-10 group !size-6 lg:!size-8 xl:!size-10',
            isFavorite ? 'bg-white' : '!bg-muted/15'
        )}
        onClick={handleFavorite}
    >
        <HeartIcon className={cn("duration-200 transition-colors ease-in-out size-3.5 lg:size-4 xl:size-6 text-white",
            isFavorite ? 'text-pink-500 fill-pink-500' : 'group-hover:text-pink-500 group-hover:fill-pink-500'

        )} />
    </Button>

}

export default FavoriteButton;