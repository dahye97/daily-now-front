export interface postInfo {
     date: string, // 날짜
     like: number, // 공감, 비공감 
     dislike: number,
     post_id: number, // 글 id 
     title: string // 제목 
     user: string // 이메일 
     views: number // 조회수
}

export interface detailPostInfo {
     content: string // 글 내용 
     date: string, // 날짜
     like: number, // 공감, 비공감 
     dislike: number,
     post_id: number, // 글 id 
     title: string // 제목 
     user: string // 이메일 
     views: number // 조회수
}