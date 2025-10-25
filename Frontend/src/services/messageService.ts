import apiClient from "../utils/apiClient";

export type Message = {
    _id: string;
    conversation: string;
    sender: {
        _id: string;
        username: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
}

interface MessagesResponse {
    messages: Message[],
    nextCursor: string | undefined,
    hasNext: boolean
}
//http://localhost:8081/api/v1/conversation/68f5f6f43e701411451b92a3/message

export const messageService = {
    fetchMessages: async (conversationId: string, cursor?: string): Promise<MessagesResponse> => {
        const result = await apiClient.get(`/conversation/${conversationId}/message`, {
            params: {
                cursor,
            }
        })
        return result.data;
    }
}