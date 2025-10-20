import { useQuery } from "@tanstack/react-query";
import { conversationService } from "../services/conversationService";


export function useConversation(){
 return useQuery({
  queryKey:['conversations'],
  queryFn:conversationService.fetchConversation,
  retry:false

 })
}