import { NextResponse } from "next/server";
import cookie from 'cookie';
import { scheduleMessageType, setScheduleMessage } from "@/services/chatService";

export async function POST(req: Request) {
    const data: scheduleMessageType = await req.json();

    let cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies['login-token'];
    if (!token) {
        return NextResponse.json({ error: 'unatutorized!!' }, { status: 401 })
    }
    let error = await setScheduleMessage(token, data);
    
    if (error !== null) {
        console.log("error:", error);
        return NextResponse.json({ error }, { status: 401 });
    }
    return NextResponse.json({ message: 'successfull' }, { status: 200 })
}