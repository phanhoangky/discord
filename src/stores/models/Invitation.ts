import type { BaseModel } from "./BaseModel";

export interface Invitation extends BaseModel {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  isAccept?: boolean;
  roomId: string;
  invitationContent: string;
}

export interface SendInvitationRequest {
  content: string;
  receiverIds: string[];
  roomId: string;
}

// export interface FetchInvitationsRequest extends BaseGetRequest {

// }

export interface ReplyInvitationRequest {
  invitationId: string;
  isAccepted: boolean;
}

export interface UpdateInvitationRequest {
  ids: string[];
  isRead: boolean;
}
