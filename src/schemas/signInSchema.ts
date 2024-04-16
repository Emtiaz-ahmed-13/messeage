import {z} from 'zod';

export const sigInSchema= z.object({
    identifier:z.string(),
    password:z.string(),
})