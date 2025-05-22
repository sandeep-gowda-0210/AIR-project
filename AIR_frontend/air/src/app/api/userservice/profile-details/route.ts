import { updateUserData } from '@/services/userService';
import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req:Request){
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token']!;
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    let userData = await req.json();
    // console.log(userData, "token: ",token, " user Id", user_id);
    if(!user_id){
        return NextResponse.json({error:"No user id specified"},{status:401});
    }
    const {data, error} = await updateUserData(token, userData, user_id);
    if(data===null)
        return NextResponse.json({error},{status:401});
    return NextResponse.json({message:'successfull'},{status:200});
}