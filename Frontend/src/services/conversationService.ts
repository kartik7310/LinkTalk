import apiClient from "../utils/apiClient";

export const conversationService = {
  fetchConversation: async () => {
    const response = await apiClient.get("/conversation");
    console.log("response here", response.data);

    // Return an empty array if no conversations exist
    return Array.isArray(response.data) ? response.data : [];
  },

  checkConnectionCode:async(connectCode:string)=>{
    console.log("connect code",connectCode);
    
    const response = await apiClient.post("/conversation/check-connection-code",{
  
        connectCode

    })
    return response.data;
  }
}


  
