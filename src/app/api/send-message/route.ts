import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { date } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    let user;

    try {
        user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User not accepting messages"
            }, { status: 403 });
        }

        const newMessage = { content, createAt: new Date() };
        user.messages.push(newMessage as unknown as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("An unexpected error :", error);
        return Response.json({
            success: false,
            message: "Failed to send message"
        }, { status: 500 });
    }
}
