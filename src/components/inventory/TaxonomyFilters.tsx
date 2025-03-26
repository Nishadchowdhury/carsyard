'use client';

import { useEffect, useState } from "react";
import { endpoints } from "../../config/endpoints";
import { FilterOptions, TaxonomyFiltersProps } from "../../config/types";
import { api } from "../../lib/apiClient";
import CustomSelect from "../ui/CustomSelect";



const TaxonomyFilters: React.FC<TaxonomyFiltersProps> = (props) => {
    const { searchParams, handleChange } = props


    const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
    const [models, setModels] = useState<FilterOptions<string, string>>([]);
    const [modelVariants, setModelVariants] = useState<FilterOptions<string, string>>([]);


    useEffect(() => {
        // iife = immediately invoked function expression
        (async function fetchMakeOptions() {
            const params = new URLSearchParams(); // creating a new url search params object

            for (const [k, v] of Object.entries(searchParams as Record<string, string>)) {
                if (v) params.set(k, v as string);
            } // adding the search params to the url

            const url = new URL(endpoints.taxonomy, window.location.origin) // creating a new url object
            url.search = params.toString() // adding the search params to the url


            const data = await api.get<{
                makes: FilterOptions<string, string>,
                models: FilterOptions<string, string>,
                modelVariants: FilterOptions<string, string>,
            }>(url.toString());

            setMakes(data.makes)
            setModels(data.models)
            setModelVariants(data.modelVariants)
        })()

    }, [searchParams])


    return (
        <>
            <CustomSelect
                label="Make"
                name="make"
                value={searchParams?.make as string}
                options={makes}
                onChange={handleChange}
            />

            <CustomSelect
                label="Model"
                name="model"
                value={searchParams?.model as string}
                options={models}
                onChange={handleChange}
                disabled={!models?.length}
            />

            <CustomSelect
                label="Model Variant"
                name="modelVariant"
                value={searchParams?.modelVariant as string}
                options={modelVariants}
                onChange={handleChange}
                disabled={!modelVariants?.length}
            />

        </>
    )

}

export default TaxonomyFilters;