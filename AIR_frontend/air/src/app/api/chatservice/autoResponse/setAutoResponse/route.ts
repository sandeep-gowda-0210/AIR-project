import { NextResponse } from "next/server";
import cookie from 'cookie';
import { setAutoReply } from "@/services/autoReplyService";

export type autoReplyType = {
    autoReplyEnabled:Boolean, historyDays:number, user_id:string,selecteduser_id:string 
}
export async function POST(req:Request) {
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    if(token){
    const data:autoReplyType = await req.json();
    const error = await setAutoReply(token,data);
    if(error!==null){
        console.log("error",error);
        return NextResponse.json({error},{status:405});
    }
    return NextResponse.json({message:"successfull"},{status:200});
    }
    return NextResponse.json({error:"Not autorized"},{status:401});
}