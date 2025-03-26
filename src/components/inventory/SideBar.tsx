'use client';

import { useRouter } from "next/navigation";
import { AwaitedPageProps, SidebarProps } from "../../config/types";
import { useEffect, useState, ChangeEvent } from "react";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { routes } from "../../config/routes";
import { env } from "../../../env.mjs";
import { cn, formatBodyType, formatColor, formatFuelType, formatOdometerUnit, formatTransmission, formatUlezCompliance } from "../../lib/utils";
import SearchInput from "../shared/SearchInput";
import TaxonomyFilter from "./TaxonomyFilters";
import RangeFilter from "./RangeFilter";
import { BodyType, Color, CurrencyCode, FuelType, OdoUnit, Prisma, Transmission, ULEZCompliance } from "@prisma/client";
import CustomSelect from "../ui/CustomSelect";



const SideBar: React.FC<SidebarProps> = (props) => {

    const { minMaxValues, searchParams } = props;

    const { _min, _max } = minMaxValues

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

    const handleChange = async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setQueryStates({ [name]: value || null })

        if (name === "make") {
            setQueryStates({ model: null, modelVariant: null })
        }

        router.refresh()
    }

    return (
        <div className='py-4 w-[21.25rem] bg-white border-r border-muted hidden lg:block ' >
            <div>

                {/* Header of the sidebar */}
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

                {/* Divider */}
                <div className="mt-2 " />
            </div>

            {/* Search input */}
            <div className="p-4">
                <SearchInput
                    placeholder="Search classifieds..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 "
                />
            </div>

            <div className="p-4 space-y-2">
                <TaxonomyFilter
                    searchParams={searchParams}
                    handleChange={handleChange}
                />

                {/* Divider */}
                <RangeFilter
                    label="Year"
                    minName="minYear"
                    maxName="maxYear"
                    defaultMin={_min.year || 1925}
                    defaultMax={_max.year || new Date().getFullYear()}
                    handleChange={handleChange}
                    searchParams={searchParams}
                />


                <RangeFilter
                    label="Price"
                    minName="minPrice"
                    maxName="maxPrice"
                    defaultMin={_min.price || 0}
                    defaultMax={_max.price || 21474836}
                    handleChange={handleChange}
                    searchParams={searchParams}
                    increment={1000000}
                    thousandSeparator
                    currency={{
                        currencyCode: "USD"
                    }}
                />



                <RangeFilter
                    label="Odometer Reading"
                    minName="minReading"
                    maxName="maxReading"
                    defaultMin={_min.odoReading || 0}
                    defaultMax={_max.odoReading || 1000000}
                    handleChange={handleChange}
                    searchParams={searchParams}
                    increment={5000}
                    thousandSeparator

                />


                {/* Extra select items */}
                <CustomSelect
                    label="Currency"
                    name="currency"
                    value={queryStates.currency || ""}
                    onChange={handleChange}
                    options={Object.values(CurrencyCode).map((value) => (
                        {
                            label: value,
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="Odometer Unit"
                    name="odoUnit"
                    value={queryStates.odoUnit || ""}
                    onChange={handleChange}
                    options={Object.values(OdoUnit).map((value) => (
                        {
                            label: formatOdometerUnit(value), // 
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="Transmission"
                    name="transmission"
                    value={queryStates.transmission || ""}
                    onChange={handleChange}
                    options={Object.values(Transmission).map((value) => (
                        {
                            label: formatTransmission(value),
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="Fuel Type"
                    name="fuelType"
                    value={queryStates.fuelType || ""}
                    onChange={handleChange}
                    options={Object.values(FuelType).map((value) => (
                        {
                            label: formatFuelType(value),
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="Body type"
                    name="bodyType"
                    value={queryStates.bodyType}
                    onChange={handleChange}
                    options={Object.values(BodyType).map((value) => (
                        {
                            label: formatBodyType(value), // formatBodyType()
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="Color"
                    name="color"
                    value={queryStates.color || ""}
                    onChange={handleChange}
                    options={Object.values(Color).map((value) => (
                        {
                            label: formatColor(value),
                            value
                        }
                    ))}
                />
                <CustomSelect
                    label="ULEZ Compliance"
                    name="ulezCompliance"
                    value={queryStates.ulezCompliance || ""}
                    onChange={handleChange}
                    options={Object.values(ULEZCompliance).map((value) => (
                        {
                            label: formatUlezCompliance(value), // formatUlezCompliance()
                            value
                        }
                    ))}
                />



                <CustomSelect
                    label="Doors"
                    name="doors"
                    value={queryStates.doors || ""}
                    onChange={handleChange}
                    options={Array.from({ length: 6 }).map((_, i) => (
                        {
                            label: (i + 1).toString(),
                            value: (i + 1).toString()
                        }
                    ))}
                />

                <CustomSelect
                    label="Seats"
                    name="seats"
                    value={queryStates.doors || ""}
                    onChange={handleChange}
                    options={Array.from({ length: 8 }).map((_, i) => (
                        {
                            label: (i + 1).toString(),
                            value: (i + 1).toString()
                        }
                    ))}
                />


            </div>
        </div>
    )

}

export default SideBar;