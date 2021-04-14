export interface postInfo {
     count: number,
     next: string,
     previous: string,
     results: Array<postResultInfo>
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

     editable: boolean // 자신의 글인지 권한 확인 : true면 수정, 삭제 가능
     like_dislike: number // 1: 좋아요 0: 싫어요 -1: 누르지 않음
}
export interface postResultInfo {
     date: string, // 날짜
     like: number, // 공감, 비공감 
     dislike: number,
     post_id: number, // 글 id 
     title: string // 제목 
     user: string // 이메일 
     views: number // 조회수
}