import type { Message } from "../models/Message";

export const checkIfUserIsReceiverOfMessage = (
  userId: string,
  message: Message
) => {
  if (message.messageRecipients.some((mr) => mr.recepientId == userId)) {
  }
};
