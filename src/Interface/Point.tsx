
export interface pointInfo {
     action: string, // 포인트 유형
     date: Date, // 날짜
     detail_action: string, // 포인트 세부 설명
     point: number, // 획득 or 소멸 포인트
     total_point: number // 누적 포인트
 }