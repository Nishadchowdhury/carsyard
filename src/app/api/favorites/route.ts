import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { setSourceId } from "@/lib/sourceId";
import { redis } from "@/lib/redisStore";
import { Favorites } from "@/config/types";
import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";

const validateSchema = z.object({ id: z.number().int()}) // this schema will validate is number then is int=integer.

export const POST = async (req: NextRequest) => { //Handles POST requests for adding or removing favorites.
    const body = await req.json(); //Extracts the JSON body from the request.

    const { data, error } = validateSchema.safeParse(body); //Parses the JSON body against the defined schema. data is the body of the request and error is the error provided by the schema.

    // these validations are important cz the schema doesn't do this anyway.
    if (!data) return NextResponse.json({ error: error?.message }, { status: 400 })

    if (typeof data.id !== "number") return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const sourceId = await setSourceId(); // this will set the sourceId in the cookies.
    // retrieve the existing favorites from redis session if it exists.
    const storeFavorites = await redis.get<Favorites>(sourceId);
    const favorites: Favorites = storeFavorites || { ids: [] }; // if the favorites are not found, it will be an empty array.

    if (favorites.ids.includes(data.id)) {
        // add or remove the id based on its current presence in the favorites
        // remove the ID if it already exists
        favorites.ids = favorites.ids.filter((favId) => favId !== data.id);
    } else {
        // add the ID if it doesn't exist
        favorites.ids.push(data.id);
    }

    // update the redis store with the new list of ides
    await redis.set(sourceId, favorites) // (key, value)

    revalidatePath(routes.favorites) // revalidates the favorites page. this will update the cache and the page will be updated.
    return NextResponse.json({ ids: favorites.ids }, { status: 200 }) // returns the new list of ids.
}