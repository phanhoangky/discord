export const enum API_URL {
  BASE_URL = "https://localhost:44335",
  AUTHENTICATE = "auth",
  ROOM = "room",
  USER = "user",
  MESSAGE = "message",
  INVITATION = "invitation",
  MESSAGE_RECIPIENT = "message-recipient",
}

export const enum CHAT_HUB_METHOD {
  RECEIVE_MESSAGE = "ReceiveMessage",
  RECEIVE_INVITATION = "ReceiveInvitation",
  RECEIVE_GROUP_MESSAGE = "ReceiveGroupMessage",
  USER_LEAVE_GROUP = "UserLeaveGroup",
  SEND_MESSAGE = "OnSendMessage",
  INVITATION_ACCEPTED = "OnInvitationAccepted",
}
