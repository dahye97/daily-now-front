// 관리자 좌측 메뉴
export interface menuInfo {
    category_id: number,
    category_name: string,
    url: string,
    child_category?: menuInfo[],
    index?: number
}

// 회원 정보 
export interface memberInfo {
    id: number,
    username: string,
    email: string,
    date_joined: string, // 가입일
    num_comment: number, // 댓글 수
    num_post: number, // 게시글 수
    total_point: number // 총 포인트
}

export interface statisticsInfo {
    new_user: number, // 신규 가입 수
    total_user: number, // 일일 누적 회원 수 
    withdrawal_user: number // 탈퇴 회원 수 
}