import { useConversationsContext } from "../../context/conversationContext"
import ConversationItem from "./ConversationItem";


const Conversations = () => {
    const {filteredConversations,isError,isLoading} = useConversationsContext();
     console.log("connver",filteredConversations);
     
    if (isLoading) {
        return <div className="flex-1 h-full items-center justify-center">
            <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
        </div>
    }
    
    if (isError) {
        return <div>Something went wrong</div>
    }

   return <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => <ConversationItem key={conversation.conversationId} {...conversation} />)}
       
        
    </div>
}

export default Conversations
