import { sendScheduledMessage } from '@/services/chatService';
export async function GET() {
      return await sendScheduledMessage()
}
