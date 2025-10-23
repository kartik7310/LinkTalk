import apiClient from "../utils/apiClient";

export const conversationService={
   fetchConversation:async()=>{
    const response = await apiClient.get("/conversation");
 
    
    return response.data;
   },

  checkConnectionCode:async(connectCode:string)=>{
    const response = await apiClient.post("/api/v1/conversation/check-connection-code",{
      params:{
        connectCode
      }
    })
    return response.data;
  }
}