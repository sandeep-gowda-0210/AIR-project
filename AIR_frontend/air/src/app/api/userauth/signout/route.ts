import { NextResponse } from "next/server";
import { signOut } from "@/services/authService";
export async function POST(req: Request){
    const error = await signOut();
    if (error) {
        return NextResponse.json({ error: 'Failed signout' }, { status: 401 });
      }
    const res = NextResponse.json({success:true});
    res.cookies.set('login-token', '');
    return res;
}