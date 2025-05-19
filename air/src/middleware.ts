import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import cookie from 'cookie';
import supabase from "@/lib/supabaseClient";

export async function middleware(req: NextRequest){
    // const cookies = cookie.parse(req.headers.get('cookie')||'');
    // const {data,error} = await supabase.auth.getUser(cookies['login-token']);
    // if(error || !data){
    //     return NextResponse.redirect(new URL('/pages/login',req.url));
    // }
    // return NextResponse.next();
    
    const cookies = cookie.parse(req.headers.get('cookie')||'');
    const {data,error} = await supabase.auth.getUser(cookies['login-token']);
    if(error || !data){
        return NextResponse.redirect(new URL('/pages/login',req.url));
    }
    const res = NextResponse.next();
    // res.headers.set('user-email', data.user.email!);

    return res;

}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|pages/login|pages/signup).*)',
      ],
  };
