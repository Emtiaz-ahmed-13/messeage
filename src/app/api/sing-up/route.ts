// Import necessary modules and functions
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helper/sendVerificationEmail';
import User from '@/model/User';

// Define the POST request handler function
export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();
    try {
        // Extract username, email, and password from the request body
        const { username, email, password } = await request.json();

        // Check if a user with the provided email already exists
        const existingUserVerifiedByUsername = await User.findOne({ email });
        // Generate a verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserVerifiedByUsername) {
            // If a user with the email exists, return an error response
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        } else {
            // Check if a user with the provided email already exists
            const existingUserByEmail = await UserModel.findOne({ email });
            if (existingUserByEmail) {
                // If a user with the email exists
                if (existingUserByEmail.isVerified) {
                    // If the user is already verified, return an error response
                    return Response.json({
                        success: false,
                        message: "User already exists with this email"
                    }, { status: 400 });
                } else {
                    // If the user is not verified, update password and verification code
                    const hashedPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashedPassword; // Update password... 
                    existingUserByEmail.verifyCode= verifyCode; 
                    existingUserByEmail.verifyCodeExpiry = new Date(verifyCode); // Convert verifyCode to a Date object
                    await existingUserByEmail.save();
                }
            } else {
                // If no user with the email exists, create a new user
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                //object milse tai or vitor changese hoya tai aikhne const likhar poreiioo.. changes kora gelo....!!!!

                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    Message: []
                });

                await newUser.save();
            }

            // Send a verification email...
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            // If sending the verification email fails, return an error response
            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, { status: 500 });
            }

            // If everything is successful, return a success response
            return Response.json({
                success: true,
                message: "User registered successfully please verif your email..."
            }, { status: 201 });
        }
    } catch (error) {
        // If an error occurs during the registration process, return an error response
        console.error('Error processing request:', error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        });
    }
}
