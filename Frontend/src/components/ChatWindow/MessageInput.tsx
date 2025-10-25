import { Send } from "lucide-react";



const MessageInput: React.FC = () => {
    return <div className="p-4 border border-gray-200 bg-white">
        <div className="flex items-center">
            <div className="flex-1">
                <textarea 
                    placeholder="Type a message..."
                    className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    
                />
            </div>

            <div className="ml-3">
                <button
                   
                    type="button"
                    className="bg-sky-500 text-white rounded-full size-10 flex items-center justify-center hover:bg-sky-600 cursor-pointer"
                >
                    <Send className="size-[16px]"/>
                </button>
            </div>
        </div>
    </div>
}

export default MessageInput;