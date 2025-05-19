import { NextResponse } from "next/server";
import cookie from 'cookie';
import { getUser } from "@/services/authService";

export async function GET(req:Request){
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token'];
    if(!token){
        return NextResponse.json({error:'unatutorized!!'},{status:401})
    }
    let {data:profile_data,error} = await getUser(token);
    if(!profile_data || error)
        console.error("Auth Error",error)
    if(profile_data){
        return NextResponse.json({profile_data});
    }
    return NextResponse.json({error:'email header not found'},{status:400})
}