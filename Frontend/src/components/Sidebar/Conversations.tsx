import { useConversationsContext } from "../../context/conversationContext";

const Conversations: React.FC = () => {
    const {filteredConversations, isLoading, isError} = useConversationsContext();

    if (isLoading) {
        return <div className="flex-1 h-full items-center justify-center">
            <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
        </div>
    }

    if (isError) {
        return <div>Something went wrong</div>
    }

    return <div className="flex-1 overflow-y-auto">
       
    </div>
}

export default Conversations;