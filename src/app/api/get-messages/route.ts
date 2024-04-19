import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !session.user) {
        return Response.json({
            status: 401,
            message: "Not Authenticated"
        }, { status: 401 });
    }
    const userId=new mongoose.Types.ObjectId(user._id);
    try{
        const user= await UserModel.aggregate([
            { $match:{id:userId }},
            {$unwind:'$messagess'},
            {$sort:{'messgaes.createAt':-1}},
            {$group:{_id:'$_id',message:{$push:'$messagess'}}}


        ])
        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 });
    }

    catch(error){
        console.log("Failed to get messages");
        return Response.json({
            success: false,
            message: "Failed to get messages"
        }, { status: 500 });

    }




}