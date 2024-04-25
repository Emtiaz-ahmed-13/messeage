import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifycode:string
): Promise<ApiResponse> {
    try {
        const resend = new Resend('process.env.RESEND_API_KEY');    
        resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'emtiaz2060@gmail.com',
          subject: 'Hello World',
          html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
        return { success: true, message: 'Verification email sent successfully' }
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: 'Failed to send verification email' };
    }


}