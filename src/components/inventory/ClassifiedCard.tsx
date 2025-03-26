"use client";

import NextLink from "next/link";
import { routes } from "@/config/routes";
import NextImage from "next/image";
import { classifiedWithImages, Favorites, MultiStepFormEnum } from "@/config/types";
import HTMLParser from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";
import { Color, CurrencyCode, FuelType, OdoUnit, Transmission } from "@prisma/client";
import { Button } from "../ui/button";
import FavoriteButton from "./FavoriteButton";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { formatColor, formatFuelType, formatNumber, formatTransmission, formatOdometerUnit, formatPrice } from "../../lib/utils";


interface ClassifiedCardProps {
    classified: classifiedWithImages,
    favorites: number[]
}


const getKeyClassifiedInfo = (classified: classifiedWithImages) => {
    return [
        {
            id: "odoReading",
            icon: <GaugeCircle className="w-4 h-4" />,
            value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(classified.odoUnit)}`,
        },
        {
            id: "transmission",
            icon: <Cog className="w-4 h-4" />,
            value: classified?.transmission ? formatTransmission(classified.transmission) : null,
        },
        {
            id: "fuelType",
            icon: <Fuel className="w-4 h-4" />,
            value: classified?.fuelType ? formatFuelType(classified.fuelType) : null,
        },
        {
            id: "colour",
            icon: <Paintbrush2 className="w-4 h-4" />,
            value: classified?.color ? formatColor(classified.color) : null,
        },
    ];
};


const ClassifiedCard: React.FC<ClassifiedCardProps> = (props) => {

    const { classified, favorites } = props;
    const pathname = usePathname();

    const [isFavorite, setIsFavorite] = useState(favorites.includes(classified.id));

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isFavorite && pathname === routes.favorites) setIsVisible(false);

    }, [favorites, pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1, }}
                    // animate={{ opacity: 0, }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}

                    className="bg-white relative rounded-md shadow-md outline-hidden flex flex-col" >
                    <div className='aspect-3/2 relative  ' >
                        <NextLink href={routes.singleClassified(classified.slug)} className='absolute inset-0' >
                            <NextImage
                                placeholder="blur"
                                blurDataURL={classified.images[0].blurHash}
                                src={classified.images[0].src}
                                alt={classified.images[0].alt}
                                fill
                                quality={25}

                                className="object-cover"
                            />
                        </NextLink>

                        <FavoriteButton
                            isFavorite={isFavorite}
                            setIsFavorite={setIsFavorite}
                            classifiedId={classified.id}
                        />

                        <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
                            <p className="text-xs lg:text-base xl:text-lg font-semibold" >
                                {formatPrice({ price: classified.price, currency: classified.currency })}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 flex flex-col space-y-3" >
                        <div className="">
                            <NextLink
                                href={routes.singleClassified(classified.slug)}
                                className='text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary'

                            >
                                {classified.title}
                            </NextLink>


                            {/* If classified.description contains: <script>alert("Hacked!")</script> then it will be removed through HTMLParser  */}
                            {classified?.description && (
                                <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2 " >
                                    <HTMLParser html={classified.description} />
                                    &nbsp;  {/* Used for equal spacing across each card in the grid  */}
                                </div>
                            )}

                            <ul className="text-xs md:text-sm text-gray-600 xl:flex grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-4 items-center justify-between w-fit" >
                                {getKeyClassifiedInfo(classified)
                                    .filter((v) => v.value)
                                    .map(({ id, icon, value }) => {
                                        return <li key={id}
                                            className="font-semibold flex xl:flex-col items-center gap-x-1.5"
                                        >
                                            {icon} {value}
                                        </li>
                                    })}
                            </ul>
                        </div>

                        <div className="mt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-full" >
                            <Button
                                variant="outline"
                                className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                                asChild
                                size="sm"

                            >
                                <NextLink href={routes.reserve(classified.slug, MultiStepFormEnum.WELCOME)}>
                                    Reserve
                                </NextLink>
                            </Button>

                            <Button
                                className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                                asChild
                                size="sm"

                            >
                                <NextLink href={routes.singleClassified(classified.slug)}>
                                    View Details
                                </NextLink>
                            </Button>
                        </div>

                    </div>
                </motion.div>
            )}

        </AnimatePresence>
    )

}

export default ClassifiedCard;