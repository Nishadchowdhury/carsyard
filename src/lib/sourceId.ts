// this will allow us to uniquely identify each users based on their cookies in their browser
import "server-only"; // this is to ensure that the code is only run on the server as use server

import { cookies } from "next/headers"; //Allows accessing and modifying browser cookies on the server side.
import { v4 as uuid } from "uuid"; //Generates a unique identifier.


const SOURCE_ID_KEY = "sourceId"; //Defines the cookie name (sourceId).


export const setSourceId = async () => { // Assigns a unique ID if not already set
    const cookieStore = await cookies(); //Accesses the cookie store.

    let sourceId = cookieStore.get(SOURCE_ID_KEY)?.value;

    if (!sourceId) {
        sourceId = uuid(); //Generates a unique identifier.

        cookieStore.set(SOURCE_ID_KEY, sourceId, { //Sets the cookie with the unique identifier.
            path: "/",
        });
    }

    return sourceId;
}

export const getSourceId = async () => { //Retrieves the unique identifier from the cookie.         
    const cookieStore = await cookies();

    return cookieStore.get(SOURCE_ID_KEY)?.value;
}




//implemented a way to uniquely identify each user using browser cookies. Let me break it down step by step:

