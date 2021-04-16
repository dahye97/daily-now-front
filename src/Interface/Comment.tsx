
export interface commentInfo {
    comment_id : number,
    user: string,
    comment_content: string,
    date : string,
    like: number,
    dislike: number,
    post_id: number,
    parent_comment: null,
    
    editable: boolean,
    like_dislike: number
}