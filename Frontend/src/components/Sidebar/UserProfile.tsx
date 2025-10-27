import { LogOut } from "lucide-react";
import { userAuthStore } from "../../store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "../../services/authServices";

const UserProfile: React.FC = () => {
  const { user, logout } = userAuthStore();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutUser = async () => {
    await authService.logout();
    logout();
    queryClient.removeQueries({ queryKey: ["auth"] });
    navigate("/auth");
  };

  return (
    <div className="p-4 border-t border-gray-200 flex items-center space-x-3">
      <img
        src="https://avatar.iran.liara.run/public"
        alt="User"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate text-sm">
            {user ? `${user?.userName} (${user.connectCode})` : "Guest"}
        </h2>
        <p className="text-xs text-gray-500">Online</p>
      </div>
      <button
        onClick={() => logoutUser()}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UserProfile;
