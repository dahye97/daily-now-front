// User : 유저 정보, 연동 회사 정보, 계좌정보, 투자정보, 포인트 정보

// 유저 정보
export interface userInfo {
	email: string,
     username: string | null,
     auth_token: string
}

// 연동 회사 계정 정보
export interface p2pInfo {
     uid: number,
     company_name:string,
     nickname: string,
     company_id: number,
     email: string, // 연동 회사 당 유저 이메일 정보
}

// 계좌 정보
export interface accountInfo {
     account_holder : string,
     account_number : string,
     bank : string,
     deposit : string
}

// 투자 정보
export interface fundInfo {
     total_investment: string, // 누적 투자액 
     number_of_investing_products: string, // 투자한 상품 개수
     residual_investment_price: string  // 투자 잔액 
}

// 포인트 정보
export interface pointInfo {
     action: string, // 포인트 유형
     date: string, // 날짜
     detail_action: string, // 포인트 세부 설명
     point: number, // 획득 or 소멸 포인트
     total_point: number // 누적 포인트
 }