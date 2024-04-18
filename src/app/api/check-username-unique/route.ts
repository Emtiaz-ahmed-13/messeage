import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema=z.object({
    username:usernameValidation

})
export async function GET(request:Request){
    await dbConnect()
    try{
        const {searchParams} =new URL(request.url)
        const queryParam ={
            username:searchParams.get('username')
        }

        //validate with zod
        const result= usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success)
            {
                const usernameError=result.error.format().username?._errors|| []
                return Response.json ({
                    success:false,
                    message:usernameError?.length>0?
                    usernameError.join(','):
                    "Invalid username",

                
                },{status:400})
            }
            const {username} = result.data
            const exitingVerifiedUser= await UserModel.findOne({username,isVerified:true})
            if(exitingVerifiedUser){
                return Response.json({
                    success:false,
                    message:"Username already exists"
                },{status:400})
            }
            return Response.json({
                success:true,
                message:"Username is unique"
            },{status:500})

    }
    catch(err){
        console.log("error chechking",err)
        return Response.json(
            {
            success:false,
            message:"Error checking username"
            }
        )
    }
}