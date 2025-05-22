import { NextResponse } from "next/server";
import { signIn } from "@/services/authService";
export async function POST(req: Request){
    const {email,password} = await req.json();
    const {data, error} = await signIn(email,password);
    if (error || !data.session) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = data.session.access_token;
    const res = NextResponse.json({success:true});
    res.cookies.set('login-token', token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:60 * 60 * 24,
        path:'/'
    })
    // res.cookies.set('user-email', data.user.email!, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     maxAge: 60 * 60 * 24, // 1 day
    //     path: '/',
    //   });
    return res;
}