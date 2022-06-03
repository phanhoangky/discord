import type { BaseGetRequest, BaseModel } from "./BaseModel";

export interface Invitation extends BaseModel {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  isAccept?: boolean;
  roomId: string;
  content?: string | null;
}

export interface SendInvitationRequest {
  content: string;
  receiverIds: string[];
  roomId: string;
}

// export interface FetchInvitationsRequest extends BaseGetRequest {

// }
