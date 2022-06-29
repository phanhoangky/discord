import type { BaseModel, BaseRequest } from "./BaseModel";

export enum INVITATION_STATUS {
  WAITING,
  ACCEPTED,
  DECLINED,
}
export interface Invitation extends BaseModel {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  isAccept?: boolean;
  status: number;
  roomId: string;
  invitationContent: string;
}

export interface SendInvitationRequest extends BaseRequest {
  content: string;
  receiverIds: string[];
  roomId: string;
}

// export interface FetchInvitationsRequest extends BaseGetRequest {

// }

export interface ReplyInvitationRequest extends BaseRequest {
  invitationId: string;
  isAccepted: boolean;
}
export interface InvitationCompositeKey {
  id: string;
  senderId: string;
  receiverId: string;
}
export interface UpdateInvitationRequest extends BaseRequest {
  invitations: Invitation[];
  isRead: boolean;
}

export interface UpdateInvitationByUserRequest extends BaseRequest {
  userId: string;
  invitationIds: string[];
  isRead: boolean;
}
