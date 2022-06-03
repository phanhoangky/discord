export interface BaseModel {
  id: string;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
}

export interface BaseGetRequest {
  currentItemsCount: number;
  isPaging: boolean;
  isInfiniteScroll: boolean;
  itemsPerPage: number;
  currentPage: number;
}
