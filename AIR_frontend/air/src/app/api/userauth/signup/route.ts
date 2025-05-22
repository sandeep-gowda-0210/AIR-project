import { NextResponse } from "next/server";
import { signUp } from "@/services/authService";
export async function POST(req: Request){
    // console.log("entered");
    const {email,password, username, firstname} = await req.json();
    const {data:token, error} = await signUp(email, password, username, firstname);
    // console.log("token" ,token);
    if (error || !token) {
        return NextResponse.json({ error: 'Failed signUp' }, { status: 401 });
      }
    const res = NextResponse.json({success:true},{status:200});
    res.cookies.set('login-token', token,{
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      maxAge:60 * 60 * 24,
      path:'/'
  })
    return res;
}