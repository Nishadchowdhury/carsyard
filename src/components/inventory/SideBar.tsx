'use client';

import { useRouter } from "next/navigation";
import { AwaitedPageProps } from "../../config/types";
import { useEffect, useState } from "react";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { routes } from "../../config/routes";
import { env } from "../../../env.mjs";
import { cn } from "../../lib/utils";


interface pageProps extends AwaitedPageProps {
    minMaxValues: any;
}
const SideBar: React.FC<pageProps> = (props) => {

    const { minMaxValues, searchParams } = props;

    const router = useRouter()
    const [filterCount, setFilterCount] = useState(0)

    const [queryStates, setQueryStates] = useQueryStates({
        make: parseAsString.withDefault(""),
        model: parseAsString.withDefault(""),
        modelVariant: parseAsString.withDefault(""),
        minYear: parseAsString.withDefault(""),
        maxYear: parseAsString.withDefault(""),
        minPrice: parseAsString.withDefault(""),
        maxPrice: parseAsString.withDefault(""),
        minReading: parseAsString.withDefault(""),
        maxReading: parseAsString.withDefault(""),
        currency: parseAsString.withDefault(""),
        odoUnit: parseAsString.withDefault(""),
        transmission: parseAsString.withDefault(""),
        fuelType: parseAsString.withDefault(""),
        bodyType: parseAsString.withDefault(""),
        color: parseAsString.withDefault(""),
        doors: parseAsString.withDefault(""),
        seats: parseAsString.withDefault(""),
        ulezCompliance: parseAsString.withDefault(""),
    }, {
        shallow: false
    })


    useEffect(() => {
        const filterCount = Object.entries(searchParams as Record<string, string>).filter(([key, value]) => key !== "page" && value).length;
        setFilterCount(filterCount)


    }, [searchParams])

    const clearFilters = () => {
        const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL)
        window.location.replace(url.toString())
        setFilterCount(0)
    }
    return (
        <div className='py-4 w-[21.25rem] bg-white border-r border-muted block' >
            <div>
                <div className="text-lg font-semibold flex justify-between px-4 ">
                    <span>Filters</span>

                    <button
                        aria-disabled={!filterCount}
                        type="button"
                        className={cn("text-sm text-gray-500 py-1", 
                            !filterCount ? "disabled opacity-50 pointer-events-none cursor-default"   
                            : "hover:underline cursor-pointer"
                        )}

                        onClick={clearFilters}
                    >
                        Clear all {filterCount ? `(${filterCount})` : null}
                    </button>
                </div>
            </div>
        </div>
    )

}

export default SideBar;