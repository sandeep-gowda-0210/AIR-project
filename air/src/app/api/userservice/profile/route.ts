import cookie from 'cookie';
import { uploadProfile } from '@/services/userService';
import { NextResponse } from 'next/server';
export async function POST(req:Request){
    let cookies = cookie.parse(req.headers.get('cookie')||'');
    let token = cookies['login-token']!;
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const user_id = formData.get('user_id')?.toString();
    // console.log(file.name, user_id);
    
    if(!file || !user_id){
        return NextResponse.json({error:"no file uploaded"},{status:400});
    }
    const {data:url_path,error} = await uploadProfile(file, user_id,token);

    if(error)
        return NextResponse.json({error:error},{status:401});
    return NextResponse.json({message:'uploaded successfully',url_path},{status:200,headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },});
}