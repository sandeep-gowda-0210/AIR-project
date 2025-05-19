import { NextResponse } from "next/server";
import cookie from 'cookie';
import { getScheduledMessages } from "@/services/chatService";

export async function GET(req:Request) {
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    const { searchParams } = new URL(req.url);
    const from_user_id = searchParams.get('from_user_id');
    const to_user_id = searchParams.get('to_user_id');
    console.log(from_user_id, " ", to_user_id);
    if(token && from_user_id && to_user_id){
        const {data,error} = await getScheduledMessages(token,from_user_id, to_user_id);
        if(error!==null || data===null){
            return NextResponse.json({error,message:"No data found"},{status:400});
        }
        console.log(data,"    ", error);
        return NextResponse.json({data},{status:200});
        
    }
    return NextResponse.json({error:"send valid credentials"},{status:401});
}