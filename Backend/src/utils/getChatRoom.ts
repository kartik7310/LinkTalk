export const getChatRoom = (userId1: string, userId2: string) => {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
};