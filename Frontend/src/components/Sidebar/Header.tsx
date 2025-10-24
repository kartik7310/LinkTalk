import { Contact, Settings } from "lucide-react";
import AddConversationModal from "./AddConversationModal";
import { useState } from "react";
const Header: React.FC = () => {
   const [isOpen,setIsOpen] = useState(false)


    return <div className="p-4 bg-sky-500 text-white flex items-center justify-between">
        <h1 className="text-xl font-bold">Messages</h1>
        <div className="flex space-x-3">
            <button onClick={()=>setIsOpen(true)} className="p-2 rounded-full cursor-pointer">
                <Contact className="size-[16px]"/>
            </button>
            <button className="p-2 rounded-full cursor-pointer">
                <Settings className="size-[16px]"/>
            </button>
        </div>
        <AddConversationModal isOpen={isOpen} onClose={()=>setIsOpen(false)} />
    </div>
}

export default Header;