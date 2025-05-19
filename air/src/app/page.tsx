import { redirect } from "next/navigation";
export default function Page(req:Request){
    redirect('/pages/home/chat-page');
}