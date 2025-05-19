import { User } from '@/app/pages/home/layout';
import { createClient } from '@supabase/supabase-js';
export const uploadProfile = async(file:File , user_id:string, token:string) =>{
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
    const fileExt = file.name.split('.').pop();
    const filePath = `${user_id}/profile.${fileExt}`;
    // console.log("entered");
    
    const {error:uploadError} = await supabaseWithToken.storage.from('profile-pictures').upload(filePath,file,{
        upsert:true,
        contentType:file.type
    });
    // console.log("entered->",uploadError);

    if (uploadError){
        return {data:null, uploadError};
    }
    const {data:publicUrlData} = await supabaseWithToken.storage.from('profile-pictures').getPublicUrl(filePath);
    // console.log(publicUrlData);
    
    const {data:updatedData,error:updateProfileURLError} = await supabaseWithToken.from('Profile').update({profile_url:publicUrlData?.publicUrl}).eq('user_id',user_id)
    if(updateProfileURLError || !updatedData)
      return {data:null,error:updateProfileURLError};
    return {data:publicUrlData,error:null};
}

export const updateUserData = async(token:string, userdata:Partial<User>, user_id:string)=>{
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

  const {data,error} = await supabaseWithToken.from('Profile').update(userdata).eq('user_id',user_id);
  if(error && !data){
    return {data:null,error};
  }
  return {data, error:null};
}