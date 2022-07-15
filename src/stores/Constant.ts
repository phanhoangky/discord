export const enum API_URL {
  // BASE_URL = "https://localhost:44335",
  BASE_URL = "https://simple-discord.herokuapp.com",
  AUTHENTICATE = "auth",
  ROOM = "room",
  ROOM_USER = "room-user",
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
  ON_USER_ONLINE = "OnUserOnline",
  ON_USER_OFFLINE = "OnUserOffline",
}

export const defaultAvatarURL = () => {
  const imgUrl = new URL("../../../assets/defaultuser.png", import.meta.url);
  return imgUrl.toString();
};
