'use client';

import { useQueryState } from "nuqs";
import { ChangeEvent, InputHTMLAttributes, useCallback, useRef } from "react";
import debounce from "debounce";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";


interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}


function debounceFunc<T extends (...args: any[]) => any>(
    func: T, 
    wait: number,
    opts: { immediate: boolean }
) {
    return debounce(func, wait, opts)
    //<T extends (...args: any[]) => any>
    //T is a generic type that represents a function.
    //T extends (...args: any[]) => any means:
    //T must be a function.
    //The function can have any number of arguments (...args: any[]).
    //It can return anything (=> any).

    //'T' is going to be a type declared at run-time instead of compile time. The T variable could be any non-declared variable
}

const SearchInput: React.FC<SearchInputProps> = (props) => {

    const { className, ...rest } = props;

    const [q, setSearch] = useQueryState("q", { shallow: false });

    const inputRef = useRef<HTMLInputElement>(null); // this will be used to clear the search input 

    const handleSearch = useCallback(
        debounceFunc((value: string) => { setSearch(value || null) }, 500, { immediate: false }), 
        [], // dependency array
    )


    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        handleSearch(newValue);
    }

    const clearSearch = () => {
        setSearch(null)
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className='' >
            <form
                action=""
                className="relative flex"

            >
                <SearchIcon
                    className="absolute left-2.5 top-2.5 size-4 text-gray-500"
                />
                <Input
                    ref={inputRef}
                    defaultValue={q || ""}
                    className={cn(className, "pl-8")}
                    onChange={onChange}
                    type="text"
                    {...rest}
                />

                {
                    q && (
                        <XIcon
                            className="absolute right-2.5 top-2.5 size-4 text-white bg-gray-500 p-0.5 rounded-full cursor-pointer"
                            onClick={clearSearch}
                        />
                    )
                }

            </form>
        </div>
    )

}

export default SearchInput;