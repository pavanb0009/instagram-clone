import BlankContent from '@/components/custom/messages/BlankContent'
import MessageLayout from '@/components/custom/messages/MessageLayout'

export const metadata = {
  title: `Chats Instagram`,
  description: "A social app",
};

const page = () => {
  return (
    <div>
      <MessageLayout>
        <BlankContent />
      </MessageLayout>
    </div>
  )
}

export default page