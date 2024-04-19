import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !session.user) {
        return Response.json({
            status: 401,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 });
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",

        }, { status: 200 });

    } catch (err) {
        console.log("Failed to update user status to accept messages");
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !session.user) {
        return Response.json({
            status: 401,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return Response.json({
            success: false,
            message: " Error is getting messages accepting status"
        }, { status: 500 });
    }


}