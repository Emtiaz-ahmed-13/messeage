import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAccesptingMessage ?: boolean;
    messages ?: Array<Message>;

}