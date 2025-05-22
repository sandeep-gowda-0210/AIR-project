import { NextResponse } from "next/server";
import cookie from 'cookie';
import { fetchMessages, getContacts } from "@/services/chatService";

export async function GET(req:Request){
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    const { searchParams } = new URL(req.url);
    const from_user_id = searchParams.get('from');
    const to_user_id = searchParams.get('to');
    if (!from_user_id || !to_user_id) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
      }
    if(!token){
        return NextResponse.json({error:'unatutorized!!'},{status:401})
    }
    let {data:messageData,error} = await fetchMessages(token,from_user_id,to_user_id);
    // console.log("messages",messageData, "error", error);
    if (messageData) {
            return NextResponse.json({ messages: messageData }, { status: 200 });

    }
    if(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
}