# 🚀 About Project
> 개인 맞춤화 뱅킹 서비스

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
    * Calendar : 월간 투자 내역 달력 기능 (보류) 
    * Product : 모집 중인 상품 리스트 기능 (보류)
  * MyPage : 회원 탈퇴 및 정보 수정 페이지 
  * Randing : 서버 구동 시 첫 화면 랜딩 페이지


---------------------
## Frontend & Backend

### **구현 & 이슈**

> ### CORS, (Unsupported Media Type) : 다시 발생한 CORS에러 🤬
🔗 [CORS 에러 모아보기]()

> ### 사용자의 고유키 저장 및 교환
* Frontend와 Backend는 **고유키(토큰)을 이용하여 유저를 인증**할 수 있다. 
* 대표적으로 **쿠키, 세션/로컬 스토리지**가 존재한다.
  - 이 프로젝트에서는 쿠키를 이용하였으며, 백에서 보내준 `Auth_token` 값을 set cookie로 저장하며 이를 헤더로 `request` 하여 백에게 유저를 인증할 수 있다. 

🔗 [request header로 토큰 전송]()

> ### 내가 작성한 글/댓글/공감 수정, 삭제, 취소
🔗 [More Detail Here]()

> ### 공감, 비공감 저장 및 취소와 그에 따른 아이콘 색 변경 처리 
🔗 [More Detail Here]()

> ### 댓글의 답글 창 열기 처리
🔗 [More Detail Here]()

> ### 연동 회사 유저 정보 새로고침 기능 처리
* 기존에는 연동 회사를 클릭할 때마다 유저가 연동한 회사의 데이터들을 크롤링해서 가져왔었다. 이 부분에 대해 MIT님이 새로고침 기능을 추가해서 불필요한 api 호출을 막는 게 좋을 것 같다는 리뷰를 해주셨기에 프론트, 백 모두 코드를 수정하게 되었다. 
  - 최초 연동 회사를 등록할 때에는 API를 호출하도록 하여 업데이트를 시켜주도록 한다. 
  - 이후, 연동 회사를 클릭할 때에는 DB 에서의 데이터를 가져올 수 있도록 하고, 새로고침 버튼을 클릭할 때에는 다시 API를 호출하여 데이터를 동기화 시켜줄 수 있도록 구현하기로 했다.

### **TIL** 📚

- POSTMAN 등의 도구를 통하여 백엔드의 서버와 잘 통신이 되고 있는지, 백엔드에서 원하는 데이터 형태는 무엇인지 잘 확인해야 한다.

- 각자 보내줄 데이터의 형식과 이름이 제대로 통일되어 있지 않으면 데이터를 원하는 곳에 주거나 받아올 수 없다. 이 과정에서 백엔드와의 원활한 의사소통은 필수!

- POST, GET 시 사용하는 데이터 구조, 변수명, 헤더에 토큰을 넣어주지 않았다던가 데이터 TYPE을 추가해주지 않아서 데이터가 오지 않았다던가 간단한 이유로 이슈가 많이 생김. 

------------

## React 
### **구현 & 이슈**
> ### React가 `BottomNavigation`의 props인 `showLabels`를 인식하지 못하는 문제
🔗 [More Detail Here](https://velog.io/@da__hey/Material-UI-Issue-React-does-not-recognize-the-showLabel-prop)

> ### 컴포넌트의 분리
🔗 [More Detail Here]()

> ### 카카오톡 공유 API 이용하기
🔗 [More Detail Here](https://velog.io/@da__hey/React-React-Typescript%EB%A5%BC-%ED%86%B5%ED%95%B4-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-%EB%A9%94%EC%8B%9C%EC%A7%80-%ED%94%8C%EB%9E%AB%ED%8F%BC-API-%EC%9D%B4%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0)


### **TIL** 📚
> ### react-router
- React Router로 렌더링하는 컴포넌트에 prop 전달하기 : router의 컴포넌트를 설정할때 props까지 같이 보내주고 싶을 때 `render`를 사용한다.
```
<Route exact path="/mypage" render={() => <Home handleLogOut={handleLogOut} />} />
```
* url을 변경하고 싶을 땐, `history`와 `document.location.href`를 사용할 수 있다.

* 동일 컴포넌트 내에서 페이지를 렌더링 해주고 싶을 때, 두 path를 한 컴포넌트에 할당하고, 컴포넌트에 props를 추가해주어 컴포넌트 내로 들어오는 props 값에 따라 렌더링 해줄 수 있다!

-----------

## Typescript 
* `typescript import image cannot find module`
- `index.d.ts` 파일을 생성하여 `declare module '*.png'`를 추가해준다.
