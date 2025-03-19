"use client"
// read docs/features/pagination.txt

import React, { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs';
import { env } from '@/env';

import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '../../lib/utils';
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';



interface pageProps {
    baseUrl: string;
    totalPages: number;
    maxVisiblePages?: number | undefined;
    styles: {
        paginationRoot: string;
        paginationPrev: string;
        paginationNext: string;
        paginationLink: string;
        paginationLinkActive: string;
    }
}

const CustomPagination: React.FC<pageProps> = (props) => {
    const { baseUrl, totalPages, maxVisiblePages = 5, styles } = props;


    // read docs/features/nuqs.txt
    const [currentPage, setPage] = useQueryState("page", { // this hook will update the search params to the url
        defaultValue: 1, // default value is 1 means if the page is not in the url then it will be 1
        parse: (value) => { // this function will parse the value to a number and return the number. if the value is not a number or less than 1 then return 1
            const parsed = Number.parseInt(value, 10); // (value, radix) // radix is the base of the number system to use. 10 is the decimal system.  
            // 2  (binary: "10" in base 2 = 2 in decimal)
            // 8  (octal: "10" in base 8 = 8 in decimal)
            return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
        }, // the value in converted to a number to be used in the component through the state.
        serialize: (value) => value.toString(), // this will convert the value to a string to be used in the url.
        shallow: false, // true will update the url without a new server request.
    });

    const [visibleRange, setVisibleRange] = useState({
        start: 1,
        end: Math.min(maxVisiblePages, totalPages),
    });

    useEffect(() => {  // read docs/features/pagination.txt 
        const halfVisible = Math.floor(maxVisiblePages / 2); // this will return half of the numbers to be displayed as pagination items.
        const newStart = Math.max(1, Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1)); // this will return the first pageNumber to be displayed.
        const newEnd = Math.min(newStart + maxVisiblePages - 1, totalPages); // this will return the last pageNumber to be displayed.

        setVisibleRange({
            start: newStart,
            end: newEnd,
        });

    }, [currentPage, totalPages, maxVisiblePages]);

    const createPageUrl = (pageNumber: number) => {
        const url = new URL(baseUrl, env.NEXT_PUBLIC_APP_URL); // this takes base of the url and the app url. then combine as a new url object. such as https://www.example.com/inventory ------ appUrl/baseUrl
        url.searchParams.set("page", pageNumber.toString()); // this will set the page number to the url. such as https://www.example.com/inventory?page=1
        return url.toString(); // this will return the url as a string. such as https://www.example.com/inventory?page=1
    }

    const handleEllipsisClick = (direction: "left" | "right") => {
        const newPage = direction === "left" ? Math.max(1, visibleRange.start - maxVisiblePages) : Math.min(totalPages, visibleRange.end + maxVisiblePages);

        
        // const newPage_ = direction === "left" ? 1 : totalPages;

        // setPage(newPage);
        setPage(newPage);
    }


    return (
        <PaginationRoot
            className={styles.paginationRoot}
        >
            <PaginationContent className={"lg:gap-4 justify-end"} >
                <PaginationItem>

                    <PaginationPrevious
                        className={cn(
                            currentPage <= 1 && "opacity-50 cursor-not-allowed pointer-events-none",
                            styles.paginationPrev,
                        )}
                        href={createPageUrl(currentPage - 1)}
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                                setPage(currentPage - 1)
                            }
                        }}
                        title='Previous Page'
                    >
                        <ChevronLeft />
                    </PaginationPrevious>
                </PaginationItem>


                {/*  */}

                {visibleRange.start > 1 && (
                    <PaginationItem className='hidden lg:block' >
                        <PaginationEllipsis
                            className={styles.paginationLink}
                            onClick={(e) => {
                                e.preventDefault()
                                handleEllipsisClick("left")
                            }}
                            title='First Page'
                        >
                            <ChevronsLeft />
                        </PaginationEllipsis>
                    </PaginationItem>
                )}

                {/* pages go here */}
                {Array.from( { length: visibleRange.end - visibleRange.start + 1 }, (_, index) => visibleRange.start + index)
                    .map((pageNumber) => {
                        const isActive = pageNumber === currentPage;
                        let rel = '';

                        if (pageNumber === currentPage - 1) {
                            rel = 'prev';
                        } else if (pageNumber === currentPage + 1) {
                            rel = 'next';
                        }

                        return <PaginationItem key={pageNumber} >
                            <PaginationLink
                                isActive={isActive}
                                href={createPageUrl(pageNumber)}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage(pageNumber)
                                }}
                                className={cn(
                                    styles.paginationLink,
                                    isActive && styles.paginationLinkActive
                                )}

                                {...(rel ? { rel } : {})} // this will add the rel attribute to the pagination link. such as rel="prev" or rel="next" // this will let the google search engine know that the page is related to the previous or next page. 

                            >
                                {pageNumber}
                            </PaginationLink>

                        </PaginationItem>;
                    })
                }


                {visibleRange.end < totalPages && (
                    <PaginationItem className='hidden lg:block' >
                        <PaginationEllipsis
                            className={styles.paginationLink}
                            onClick={(e) => {
                                e.preventDefault()
                                handleEllipsisClick("right")
                            }}
                            title='Last Page'
                        >
                            <ChevronsRight />
                        </PaginationEllipsis>
                    </PaginationItem>
                )}

                {/*  */}


                <PaginationItem>
                    <PaginationNext
                        className={cn(
                            currentPage >= totalPages && "opacity-50 cursor-not-allowed pointer-events-none",
                            styles.paginationNext,
                        )}
                        href={createPageUrl(currentPage + 1)}
                        onClick={(e) => {
                            e.preventDefault()

                            if (currentPage < totalPages) {
                                setPage(currentPage + 1)
                            }
                        }}
                        title='Next Page'

                    >
                        <ChevronRight />
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>

        </PaginationRoot>
    )

}

export default CustomPagination;