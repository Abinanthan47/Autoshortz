import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const CreateNewUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),
        pictureURL:v.string(),
    },
    handler:async(ctx,args)=>{
        // For demo purposes, just return mock user data
        const userData = {
            _id: "mock-user-id",
            name: args?.name || "Demo User",
            email: args?.email || "demo@example.com",
            pictureURL: args?.pictureURL || "",
            credits: 10
        }
        return userData;
    }
})