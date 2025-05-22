import { NextResponse } from "next/server";
import cookie from 'cookie';
import { getContacts } from "@/services/chatService";

export async function GET(req:Request){
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    if(!token){
        return NextResponse.json({error:'unatutorized!!'},{status:401})
    }
    let contactList = await getContacts(token);
    
    if(contactList){
        return NextResponse.json({contactList});
    }
    return NextResponse.json({error:'no contacts found'},{status:400})
}