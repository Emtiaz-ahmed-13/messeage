import {z} from 'zod';

export const verifySchema= z.object({
    code:z.string().length(6,{message:"varification code must be 6 characters long"})
})