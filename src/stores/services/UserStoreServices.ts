import ApiHelper from "@/api";
import { API_URL } from "../Constant";
import type {
  GetUserRequest,
  UpdateNotReadMessageOfUser,
} from "../models/User";

export const callGetUsers = async (request?: any) => {
  const base: GetUserRequest = {
    currentItemsCount: 0,
    currentPage: 0,
    isInfiniteScroll: false,
    isPaging: false,
    isLoading: true,
    itemsPerPage: 10,
    ...request,
  };
  const { data } = await ApiHelper.get(`${API_URL.USER}`, { params: base });
  return data;
};

export const callGetUserByRoom = async (request?: any, roomId?: string) => {
  const base: GetUserRequest = {
    currentItemsCount: 0,
    currentPage: 0,
    isInfiniteScroll: false,
    isPaging: false,
    isLoading: true,
    itemsPerPage: 10,
    ...request,
  };
  const { data } = await ApiHelper.get(`${API_URL.USER}/room/${roomId}`, {
    params: base,
  });
  return data;
};

export const callGetUsersForInvitation = async (request?: any) => {
  const base: GetUserRequest = {
    isInfiniteScroll: true,
    isLoading: true,
    isNotify: false,
    isPaging: true,
    itemsPerPage: 10,
    ...request,
  };
  const { data } = await ApiHelper.get(`${API_URL.USER}/invitation`, {
    params: base,
  });
  return data;
};

export const callUpdateNotReadMessageOfUser = async (request?: any) => {
  //
  const baseRequest: UpdateNotReadMessageOfUser = {
    ...request,
    isLoading: false,
  };

  const { data } = await ApiHelper.put(
    `${API_URL.USER}/${baseRequest.currentUserId}/${baseRequest.senderId}/not-read`,
    baseRequest
  );
  return data;
};
