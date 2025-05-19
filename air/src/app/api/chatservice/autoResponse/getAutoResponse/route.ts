import { NextResponse } from "next/server";
import cookie from 'cookie';
import { getAutoReply } from "@/services/autoReplyService";

export type autoReplyType = {
    autoReplyEnabled:Boolean, historyDays:number, user_id:string,selecteduser_id:string 
}
export async function GET(req:Request) {
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    const { searchParams } = new URL(req.url);
    const from_user_id = searchParams.get('from_user_id');
    const to_user_id = searchParams.get('to_user_id');
    
    if(token && from_user_id && to_user_id){
    const {data,error} = await getAutoReply(token, from_user_id, to_user_id);
    console.log("data ", data," error", error);
    
    if(error!==null)
        return NextResponse.json({error},{status:405});
    if(data){
    const res_data = data[0];
    return NextResponse.json({data:res_data},{status:200});
    }
    }
    return NextResponse.json({error:"send valid credentials"},{status:401});
}