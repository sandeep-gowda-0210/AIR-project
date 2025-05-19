
import { autoReplyType } from "@/app/api/chatservice/autoResponse/setAutoResponse/route";
import { createClient } from '@supabase/supabase-js';
import {groq_gen_auto_reply} from '@/utils/groqai';
export const setAutoReply = async (token: string, autoReplyData: autoReplyType) => {
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

    if (autoReplyData.autoReplyEnabled) {
        const { error } = await supabaseWithToken
            .from('AutoReply')
            .upsert([{
                sender_id: autoReplyData.user_id,
                receiver_id: autoReplyData.selecteduser_id,
                history_period: autoReplyData.historyDays
            }], {
                onConflict: 'sender_id,receiver_id'
            });
        return error;
    }
    else {
        const { error } = await supabaseWithToken
            .from('AutoReply')
            .delete()
            .match({
                sender_id: autoReplyData.user_id,
                receiver_id: autoReplyData.selecteduser_id
            });
        return error
    }
}



export const getAutoReply = async (token: String, from_user_id: string, to_user_id: string): Promise<GetAutoReplyResponse>  => {
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
    const { data, error } = await supabaseWithToken.from("AutoReply").select("history_period").match({
        sender_id: from_user_id,
        receiver_id: to_user_id
    })
    // console.log("inside get auto reply ", data, error , from_user_id, to_user_id);
    
    if (error !== null) {
        return { error, data: null };
    }
    return { data, error: null }
}



export function getHistoryLocalDateTimeString(historyDays:number) {
    const now = new Date();
    const startDay = new Date(now);
    startDay.setDate(now.getDate() - historyDays);
    const offset = startDay.getTimezoneOffset();
    const localTime = new Date(startDay.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  }

export const autoReplyOllama = async (token: String, from_user_id: string, to_user_id: string,) => {
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
    const { data, error } = await supabaseWithToken.from("AutoReply").select("history_period").match({
        sender_id: to_user_id,
        receiver_id: from_user_id
    })
    if (error !== null) {
        return { error, data: null };
    }
    if (data.length > 0) {
        const now = getHistoryLocalDateTimeString(data[0].history_period);
        // console.log("date: ",now);
        
        const { data: message_history, error: fetch_error } = await supabaseWithToken.from('Message').select("sender_id, receiver_id, content")
            .or(
                `and(sender_id.eq.${from_user_id},receiver_id.eq.${to_user_id}),and(sender_id.eq.${to_user_id},receiver_id.eq.${from_user_id})`
            )
            .gte("created_at", now);
        // console.log("message_history", message_history, "error", error);
        return {data:message_history,error:null}
    }
    return { data, error: null }
}



export const generate_auto_reply = async (token: String, from_user_id: string, to_user_id: string, message: string) => {
    const { data:summary, error:affirmationError }= await autoReplyOllama(token, from_user_id, to_user_id)
    if(affirmationError!==null)
        return {data:null , affirmationError};
    const {data:replyData, error:autoGenerationError} = await groq_gen_auto_reply(summary,message);
    if(autoGenerationError!==null && replyData!==null){
        return {data:null, error:autoGenerationError}
    }
    return {data: replyData,error:null}
}

interface AutoReplyData {
    history_period?: string;
    // Add any other expected fields
}

interface GetAutoReplyResponse {
    data: AutoReplyData[] | null;
    error: Error | null;
}

export const assert_generate_autoreply = async (token: String, from_user_id: string, to_user_id: string, message: string) => {
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
    const { data, error }= await getAutoReply(token,to_user_id,from_user_id);
    // console.log("data, ", data, "error, ",error);
    
    if(
        error !== null ||
        data === null ||
        data.length === 0){
        return {data:null, error};
    }
    else{
        const {data:replyData, error:genAutoReplyError} = await generate_auto_reply(token, from_user_id,to_user_id,message)
        if(genAutoReplyError!==null && replyData!==null){
            return {data:null, genAutoReplyError};
        }
        // console.log(" AI replied ",replyData, " error ",genAutoReplyError);
        const {data:insertedData, error } = await supabaseWithToken
        .from('Message')
        .insert({sender_id:to_user_id,receiver_id:from_user_id,content:replyData}).select('*')
        .single();
        // console.log("inserted auto reply ", insertedData, " error", error);
        
        if(error!==null)
        {
            console.log("message Data inserted error", error);
            return {data:null ,error};
        }
        return {data:insertedData,error:null};
    }


}