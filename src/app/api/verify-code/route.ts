import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 });
        }

        const isCodeValid = user.verifycode == code;
        const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && iscodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 });
        } else if (!iscodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired. Please try again later." 
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Error:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
