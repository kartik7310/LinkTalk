
import Conversations from "./Conversations";
import Header from "./Header";
import SearchBar from "./Searchbar";
import UserProfile from "./UserProfile";

const Sidebar: React.FC = () => {
    return <div className="min-h-screen bg-white border-r border-gray-200 flex flex-col justify-betwen">
        <Header />
        
            <SearchBar />
            <Conversations />

        <UserProfile />
    </div>
}

export default Sidebar;