import { NextResponse } from "next/server";
import cookie from 'cookie';
import { deleteScheduledMessage } from "@/services/chatService";

export async function DELETE(req:Request) {
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    const { searchParams } = new URL(req.url);
    const message_id = searchParams.get('message_id');
    if(token && message_id){
        const {data,error} = await deleteScheduledMessage(token,message_id);
        if(error!==null || data===null){
            return NextResponse.json({error,message:"No data found"},{status:400});
        }
        console.log(data,"    ", error);
        return NextResponse.json({message:"successfully deleted"},{status:200});
        
    }
    return NextResponse.json({error:"send valid credentials"},{status:401});
}