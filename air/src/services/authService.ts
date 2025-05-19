import supabase from "@/lib/supabaseClient"
import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { createClient } from '@supabase/supabase-js';

export const getUser = async(token:string)=>{
  const supabaseWithToken = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabaseWithToken.auth.getUser();

  if (authError || !user) {
    return { data: null, error: "Auth Error" };
  }

  const { data, error } = await supabaseWithToken
    .from('Profile')
    .select('user_id,user_name,first_name,last_name,email_id,profile_url,status,bio')
    .eq('user_id', user.id);

  return {data,error};
}

export const signUp = async (email: string, password: string, username:string, firstname:string) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !authData.user) {
      return { error: signUpError || 'Signup failed', data: null };
    }
    const userId = authData.user.id;
    const token = authData.session?.access_token;
    const { error: insertError } = await supabase.from('Profile').insert({
      user_id: userId,
      email_id:email,
      user_name:username,
      first_name:firstname,
      password,
    });
    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { error: insertError, data: null };
    }
    
    return { error: null, data: token };
}




export const signIn = async(email:string, password:string)=>{
    const {data,error} = await supabase.auth.signInWithPassword({
        email,password
    })
    return {data, error};
}

export const signOut = async()=>{
    const {error} = await supabase.auth.signOut()
    return error;
}