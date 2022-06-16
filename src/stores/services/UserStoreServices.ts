import ApiHelper from "@/api";
import { API_URL } from "../Constant";
import type { GetUserRequest } from "../models/User";

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
