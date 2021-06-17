// 관리자 좌측 메뉴
export interface menuInfo {
  category_id: number;
  category_name: string;
  url: string;
  child_category?: menuInfo[];
  index?: number;
}

// 회원 정보
export interface memberInfo {
  id: number;
  username: string;
  email: string;
  date_joined: string; // 가입일
  num_comment: number; // 댓글 수
  num_post: number; // 게시글 수
  total_point: number; // 총 포인트
}

// 서버에서 받아오는 회원 관련 데이터 정보
export interface memberDataInfo {
  count: number;
  next: string;
  previous: string;
  results: Array<memberInfo>;
}
// 일일 회원 통계 정보
export interface statisticsInfo {
  new_user: number; // 신규 가입 수
  total_user: number; // 일일 누적 회원 수
  withdrawal_user: number; // 탈퇴 회원 수
}

// 카테고리 업데이트 시 정보
export interface categoryAdminInfo {
  category_id: number; // 변경할 카테고리 아이디
  new_category_name: string; // 변경할 새로운 카테고리 이름
}

// 포인트 및 사용자 정보
export interface pointAdmin {
  action: string;
  date: string;
  detail_action: string;
  email: string;
  id: number;
  point: number;
  total_point: number;
}

// 포인트 및 사용자 정보
export interface pointCategoryInfo {
  id: number;
  action: string;
  limit_number_of_day: number;
  point_value: number;
}

// 등록가능한 p2p 회사 정보
export interface companyInfo {
  company_name: string;
  homepage_url: string;
  id: number;
  nickname: string;
}
