import {z} from 'zod';

export const usernameValidation =z
    .string()
    .min(2, {message: "username must be at least 2 characters"})
    .max(20, {message: "username must be at most 20 characters long"})
    .regex(/^[a-zA-Z0-9]+$/,"username must contain only letters and numbers")


export const singUpSchema =z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message: "password must be at least 6 characters long"}),

})