// 게시판: 게시판 카테고리, 게시글, 세부 게시글, 댓글

export interface categoryInfo {
     id?: number,
     category_id : number,
     category_name: string,
     flag: boolean
}

// 서버에서 받아오는 전체 게시글 관련 데이터 정보 
export interface postInfo {
     count: number,
     next: string,
     previous: string,
     results: Array<postResultInfo>
}

// 실제 게시글 관련 데이터 정보 
export interface postResultInfo {
     date: string, // 날짜
     like: number, // 공감, 비공감 
     dislike: number,
     post_id: number, // 글 id 
     title: string // 제목 
     user: string // 이메일 
     views: number // 조회수,
     comment_count: number // 댓글 수 
}

// 세부 게시글 정보 
export interface detailPostInfo {
     category_id: number // 해당 글의 카테고리 id 
     post_id: number, // 글 id 
     
     date: string, // 날짜
     title: string // 제목 
     user: string // 이메일 
     
     content: string // 글 내용 
     
     views: number // 조회수
     like: number, // 공감, 비공감 
     dislike: number,

     editable: boolean // 자신의 글인지 권한 확인 = true : 수정, 삭제 가능, false: 불가
     like_dislike: number // 1: 좋아요, 0: 싫어요 -1: 누르지 않음
}

// 댓글 정보
export interface commentInfo {
     comment_id : number,
     user: string,
     comment_content: string,
     date : string,
     like: number,
     dislike: number,
     post_id: number,
     parent_comment: number,
     num_child : number // 답글 수
     
     editable: boolean,
     like_dislike: number
 }

 // 검색 데이터 정보
 export interface searchInfo { 
     category_id : number | string,
     page_size: number| null,
     search_type: string | string[] |null,
     search_keyword: string | string[] | null, 
     sort: string | string[] | null
 }