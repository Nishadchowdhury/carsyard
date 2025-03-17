import { Prisma } from "@prisma/client"

type Params = {
    [x: string]: string | string[]
}
export type PageProps = { // PageProps is a type for a props object that can be used in a Next.js page
    // It contains two optional properties: params and searchParams


    params?: Promise<Params>, // params:- This is a Promise that will resolve into a Params object. This means params is not immediately available—it must be awaited.
    searchParams?: Promise<{ [x: string]: string | string[] | undefined }> // searchParams:- This is a Promise that will resolve into an object where: The keys are strings. The values can be strings, arrays of strings, or undefined

}

// Since params and searchParams are Promises, we need to use await before accessing their values.


export type AwaitedPageProps = { //This type ensures that params and searchParams are already resolved before being used in the component.

    // Awaited<T> is a TypeScript utility type that extracts the value inside a Promise<T>. 
    // represents the resolved value of a promise.
    params?: Awaited<PageProps["params"]>,
    searchParams?: Awaited<PageProps["searchParams"]>
}


export type classifiedWithImages = Prisma.ClassifiedGetPayload<{ // This type ensures that the Classified object includes its associated table
    include: {
        images: true;
    }
}>


export enum MultiStepFormEnum {
    WELCOME = 1,
    SELECT_DATE = 2,
    SUBMIT_DETAILS = 3,
} 

export interface Favorites {
    ids: number[]
}
