export interface BaseModel {
  id: string;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
}

export interface BaseGetRequest extends BaseRequest {
  currentItemsCount?: number;
  isPaging?: boolean;
  isInfiniteScroll?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
}

export interface BaseRequest {
  isLoading?: boolean;
  isNotify?: boolean;
}
