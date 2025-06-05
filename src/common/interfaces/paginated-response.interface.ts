export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
