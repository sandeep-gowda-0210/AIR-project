'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import socket from '@/utils/socket';
import { useUserData } from '../../layout';
import ScheduleMessageForm from '@/components/scheduleMessage/ScheduleMessage';
import AutoReplySettings from '@/components/autoReply/AutoReply';
type Timestamp = string | Date;

export type Message = {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status?: string;
  created_at?: Timestamp;
  time_stamp?: Timestamp;
};

function ChatWindow() {
  let { user, selectedUser } = useUserData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [scheduleMessagePage, setScheduleMessagePage] = useState<Boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoReplyPage, setAutoReplyPage] = useState<Boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  

  
  const loadMessages = async () => {
    if (!currentUserId || !selectedUser?.user_id) return;

    try {
      const params = new URLSearchParams({
        from: currentUserId,
        to: selectedUser.user_id,
      });

      const res = await fetch(`/api/chatservice/getMessages?${params.toString()}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  
useEffect(() => {
  scrollToBottom();
}, [messages]);

  useEffect(() => {
    setCurrentUserId(user?.user_id || null);
  }, [user]);
  useEffect(() => {
    socket.on('receive-message', (message: Message) => {
      if (
        (message.sender_id === selectedUser?.user_id && message.receiver_id === currentUserId) ||
        (message.sender_id === currentUserId && message.receiver_id === selectedUser?.user_id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receive-message');
    };
  }, [selectedUser,currentUserId]);

  useEffect(() => {
    setAutoReplyPage(false);
    setScheduleMessagePage(false);
    setMessages([]);

    loadMessages();
  }, [currentUserId, selectedUser?.user_id]);


  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    let messagePayload: Partial<Message> = {
      sender_id: currentUserId,
      receiver_id: selectedUser.user_id,
      content: newMessage,
      // timestamp: new Date().toISOString()
    };

    socket.emit('send-message', messagePayload);

    // let messagePayload_1: Message = {
    //   id: Math.random().toString(),
    //   sender_id: currentUserId,
    //   receiver_id: selectedUser.user_id,
    //   content: newMessage,
    // }
    socket.on("sent-message",()=>{
      loadMessages();
    })
    // setMessages((prev) => [...prev, { ...messagePayload_1 }]);
    setNewMessage('');

    return ()=>{socket.off("sent-message")};
  },[newMessage, selectedUser, currentUserId]);

  useEffect(() => {
    console.log("status", scheduleMessagePage);


  }, [scheduleMessagePage])


  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };


  return (!selectedUser || !socket.id ? <div className='flex justify-center items-center h-full border-2 rounded-2xl'>No chat Selected</div> : <div className="flex flex-col h-full border rounded shadow w-full">
    {/* Top Bar */}
    <div className="flex items-center justify-between p-4 border-b bg-blend-darken">
      <div className='flex items-center'>
        <img
          src={selectedUser.profile_url}
          alt="Profile"
          className="w-9 h-10 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">{selectedUser.user_name}</h2>
      </div>
      <div className='flex  items-center gap-x-6 '>
      {!autoReplyPage &&
      <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"  onClick={() =>{
        scheduleMessagePage?setScheduleMessagePage(false):null; setAutoReplyPage(true)}} className='cursor-pointer w-fit h-fit p-1 px-2 hover:bg-[#555454] rounded-2xl transition-all duration-300 hover:ease-in-out'><path d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        }
         {autoReplyPage &&
          <svg width="30" height="30" onClick={() => setAutoReplyPage(false)} className='cursor-pointer w-fit h-fit p-1 px-2 hover:bg-[#555454] rounded-2xl transition-all duration-300 hover:ease-in-out' viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}
        {!scheduleMessagePage &&
          <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() =>{
            autoReplyPage?setAutoReplyPage(false):null; setScheduleMessagePage(true)}} className='cursor-pointer w-fit h-fit p-1 px-2 hover:bg-[#555454] rounded-2xl transition-all duration-300 hover:ease-in-out'><path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        }
        {scheduleMessagePage &&
          <svg width="30" height="30" onClick={() => setScheduleMessagePage(false)} className='cursor-pointer w-fit h-fit p-1 px-2 hover:bg-[#555454] rounded-2xl transition-all duration-300 hover:ease-in-out' viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}
      </div>
    </div>

    {/* Messages */}
    {!scheduleMessagePage && !autoReplyPage &&
      <>
        <div className="flex-1 p-4 py-3 overflow-y-auto space-y-2 bg-blend-darken">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-3xl flex h-full w-full justify-center items-center">No messages yet</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] w-fit p-2 rounded-lg text-sm ${msg.sender_id === currentUserId
                    ? 'bg-[#414141] self-end ml-auto text-right'
                    : 'bg-[#323332] self-start mr-auto'
                  }`}
              >
                <div >{msg.content}</div>
                {/* <div className="text-[10px] text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div> */}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t bg-[#4b4949] flex items-center">
          <input
            type="text"
            className="flex-1 text-lg border rounded px-3 py-1 mr-2 bg-transparent outline-0"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <input
            type="file"
            accept="image/*,video/*,.pdf,.docx,.xlsx,.txt"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />

          <button onClick={() => fileInputRef.current?.click()} className=' p-1 px-2 mx-2 rounded-lg hover:bg-[#2f2f2f] transition-all duration-300 ease-in-out cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-paperclip-icon lucide-paperclip"><path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/></svg>
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </>
    }
    {(scheduleMessagePage && !autoReplyPage && user && selectedUser) && <ScheduleMessageForm senderId={user?.user_id} receiverId={selectedUser.user_id} />}
    {(!scheduleMessagePage && autoReplyPage && user && selectedUser) && <AutoReplySettings />}
  </div>
  );
}

export default ChatWindow;