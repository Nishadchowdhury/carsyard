'use client';
import type React from 'react';
import { ChangeEvent, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';


interface pageProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    value: string;
    options: { label: string; value: string; }[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;

    selectClassName?: string;
    noDefault?: boolean; // if true, the default option will not be shown
}
const CustomSelect: React.FC<pageProps> = (props) => {

    const { label, value, options, onChange, className, selectClassName, noDefault = true, ...rest } = props;


    return (
        <div className={cn("mt-1", className, "")} >
            {label && (<h4 className="text-sm font-semibold text-gray-500" > {label} </h4>)}

            <div className="mt-1">
                <select
                    value={value || ""}
                    onChange={onChange}
                    className={cn(selectClassName, "disabled:!bg-gray-100 w-full px-3 py-2 border-input border rounded-md focus:outline-hidden custom-select appearance-none pr-12 bg-no-repeat",)}
                    {...rest}
                >
                    {noDefault && (<option value="" > Select </option>)}

                    {options.map((option) => (
                        <option key={option.value} value={option.value} >
                            {option.label}
                        </option>
                    ))}

                </select>
            </div>


        </div>
    )

}

export default CustomSelect;