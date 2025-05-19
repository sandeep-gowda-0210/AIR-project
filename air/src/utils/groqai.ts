import Groq from  'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const groq_gen_auto_reply = async(summary:any,message:string)=>{
    // console.log("This is the summary of the chat", summary, "\nmesssage, ", message);
    
    try{
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
        {
        "role":"user",
            "content": `Context:${summary} \n"instruction": "Respond as if you are from_user in the context provided and reply like how he would.Generate a response to the next message solely based on the context provided, If the context does not provide enough information to respond, do not generate a reply instead send a message that 'I are not sure' and important note is that give replies within 2 lines and all the replies within a double quotes"\n"Message": "${message}?"\nReply:`
        }
        ],
        "model": "llama-3.1-8b-instant",
        "temperature": 0.4,
    });
    let reply_message:string=chatCompletion.choices[0]?.message?.content || "out of context";
    return {data:reply_message,error:null};
}
catch(error){
    return {data:null, error};
}
}
export default groq;