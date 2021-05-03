# ⚙ Front & Back Tech

- Front : React, Typescript
- Back : Django, MySQL
- CSS : Material-UI, makeStyles/useStyles HOOK

# 🌳 Structure & Description

## Structure
```
+-- src
|	+-- Components
	|	+-- Navigation.tsx
	|	+-- Stepper.tsx
|	+-- Interface
	|	+-- User.tsx
	|	+-- Board.tsx
	|	+-- FAQ.tsx
	|	+-- Error.tsx
|	+-- Pages
	|	+-- Auth.tsx
	|	+-- Board.tsx
	|	+-- FAQ.tsx
	|	+-- Home.tsx
	|	+-- MyPage.tsx
	|	+-- Randing.tsx
| 	+-- asset
	|	+-- img
+-- App.tsx
+-- Router.tsx
+-- index.tsx
+-- react-app-env.d.ts
```

## Description

* **Components** : 재사용성이 높은 컴포넌트 폴더
* **Interface**
  * User : 사용자의 정보 및 연동 회사, 연동 계좌, 투자, 포인트 정보 관련 인터페이스
  * Board : 게시판 카테고리, 게시글, 세부 게시글, 댓글 정보 관련 인터페이스
  * FAQ : FAQ 컴포넌트 인터페이스
  * Error : 에러 처리를 위한 인터페이스
* **Pages**
  * Auth : 사용자 인증 처리를 위한 페이지
    * 로그인 및 회원가입 기능
  * Board : 투자자들의 소통을 위한 공간 제공 페이지
    * 카테고리 별 게시글 등록 및 수정, 삭제, 조회 기능
    * 댓글 등록 및 수정, 삭제 기능
    * 답글 등록 및 수정, 삭제 기능
    * 게시글 및 댓,답글 추천/비추천 기능
    * 내 글 보기 기능 
  * FAQ : 자주 하는 질문을 모아 보여주는 페이지
    * 질답 확인 기능
  * Home : 사용자의 정보를 보여주는 페이지
    * Profile
      새로고침 기능, 로그아웃 기능
      * Funding : 투자 정보를 보여주는 컴포넌트
        * 프로필, 연동 회사, 입출금 내역, 투자 내역, 잔고, 보유 계좌 조회 기능
      * Point : 포인트 정보를 보여주는 컴포넌트
        * 보유 포인트 조회 및 기간 별 포인트 상세 내역 조회 기능
      * Share : 친구 초대 기능을 제공하는 컴포넌트
        * 카카오톡 공유하기를 통한 친구 초대 기능 
  * MyPage : 회원 탈퇴 및 정보 수정 페이지 
  * Randing : 서버 구동 시 첫 화면 랜딩 페이지

