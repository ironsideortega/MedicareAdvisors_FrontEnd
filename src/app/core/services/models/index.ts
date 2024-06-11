
export interface PaginatedList<T> {
    total: number;
    list: Array<T>;
    currentPage: number;
    pages: number;
}