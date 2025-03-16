import NextLink from "next/link";
import { routes } from "@/config/routes";
import NextImage from "next/image";
import { classifiedWithImages, MultiStepFormEnum } from "@/config/types";
import HTMLParser from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";
import { Color, FuelType, OdoUnit, Transmission } from "@prisma/client";
import { Button } from "../ui/button";

interface ClassifiedCardProps {
    classified: classifiedWithImages,
}

function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) { // Format number to 2 decimal places 
    // Intl is used to format numbers to a specific locale
    // Intl.NumberFormatOptions is used to format the number to a specific locale
    // en-US is the locale
    if (num === null) return 0;
    return new Intl.NumberFormat("en-US", options).format(num);
}

function formatOdometerUnit(unit: OdoUnit) {
    return unit === OdoUnit.MILES ? "mi" : "km";
}

function formatTransmission(transmission: Transmission) {
    return transmission === Transmission.AUTOMATIC ? "Automatic" : "Manual";
}

function formatFuelType(fuelType: FuelType) {

    switch (fuelType) {
        case FuelType.PETROL:
            return "Petrol";
        case FuelType.DIESEL:
            return "Diesel";
        case FuelType.ELECTRIC:
            return "Electric";
        case FuelType.HYBRID:
            return "Hybrid";
        default:
            return "Unknown";
    }

}

function formatColor(color: Color) {
    switch (color) {
        case Color.BLACK:
            return "Black";
        case Color.BLUE:
            return "Blue";
        case Color.BROWN:
            return "Brown";
        case Color.GOLD:
            return "Gold";
        case Color.GREEN:
            return "Green";
        case Color.GREY:
            return "Grey";
        case Color.ORANGE:
            return "Orange";
        case Color.PINK:
            return "Pink";
        case Color.PURPLE:
            return "Purple";
        case Color.RED:
            return "Red";
        case Color.SILVER:
            return "Silver";
        case Color.WHITE:
            return "White";
        case Color.YELLOW:
            return "Yellow";
        default:
            return "Unknown";
    }

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

    const classified = props.classified;

    return (
        <div className="bg-white relative rounded-md shadow-md outline-hidden flex flex-col" >
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
                <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
                    <p className="text-xs lg:text-base xl:text-lg font-semibold" >
                        {classified.price}
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
                        className="flex-1  py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
                        asChild
                        size="sm"

                    >
                        <NextLink href={routes.singleClassified(classified.slug)}>
                            View Details
                        </NextLink>
                    </Button>
                </div>

            </div>
        </div>
    )

}

export default ClassifiedCard;