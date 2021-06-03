export interface menuInfo {
    category_id: number,
    category_name: string,
    url: string,
    child_category?: menuInfo[],
    index?: number
}
