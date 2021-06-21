# 🚀 About Project
> 개인 맞춤화 뱅킹 서비스

# ⚙ Front & Back Tech

<div align="center">

  <h3>✨Front-end✨</h3>

  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-round&logo=react&logoColor=black"> 
<img src="https://img.shields.io/badge/ReactRouter-CA4245?style=flat-round&logo=ReactRouter&logoColor=black"> 
  <img src="https://img.shields.io/badge/Typescript-EF2D5E?style=flat-round&logo=TYPESCRIPT&logoColor=white">

  <img src="https://img.shields.io/badge/MaterialUI-0081CB?style=flat-round&logo=Material-UI&logoColor=white">


  <h3>✨Back-end✨</h3>
  <img src="https://img.shields.io/badge/Django-092E20?style=flat-round&logo=Django&logoColor=white"> 
  <img src="https://img.shields.io/badge/MySQL-2C5BB4?style=flat-round&logo=MySQL&logoColor=white">
  <img src="https://img.shields.io/badge/Insomnia-5849BE?style=flat-round&logo=Insomnia&logoColor=white">

  <h3>🤝🏻 Cowork tools 🤝🏻</h3>
    <img src="https://img.shields.io/badge/Git-F05032?style=flat-round&logo=Material-UI&logoColor=white">
  <img src="https://img.shields.io/badge/Slack-4A154B?style=flat-round&logo=Slack&logoColor=white">
    <img src="https://img.shields.io/badge/Swagger-Doc-4285F4?style=flat-round&logo=Swagger&logoColor=85EA2D">
  <img src="https://img.shields.io/badge/GoogleDocs-Doc-4285F4?style=flat-round&logo=Google&logoColor=4285F4">
  
  <h3>🛠 IDE 🛠</h3>
    <img src="https://img.shields.io/badge/VSCode-007ACC?style=flat-round&logo=VisualStudioCode&logoColor=white">
  <img src="https://img.shields.io/badge/PyCharm-000000?style=flat-round&logo=PyCharm&logoColor=white">
  <img src="https://img.shields.io/badge/NCP-Cloud-green?style=flat-round&logo=Naver&logoColor=white">

  <h3>🛠 사용 API & Tech 🛠</h3>
  
  <p>Kakao OCR API | Kakao Link API | AES 암호화 | 크론탭 </p>

</div>

<br />

# 🌳 Structure & Description

## Structure
```
+-- src
| 	+-- asset
	|	+-- img
|	+-- Components
	|	+-- Navigation.tsx
	|	+-- Stepper.tsx
|	+-- Interface
	|	+-- Admin.tsx
	|	+-- User.tsx
	|	+-- Board.tsx
	|	+-- FAQ.tsx
	|	+-- Error.tsx
|	+-- Pages
	|	+-- Admin
	|	|   +-- UserAdmin
	|	|   +-- CategoryAdmin
	|	|   +-- FaqAdmin
	|	|   +-- PointAdmin
	|	|   +-- P2PAdmin
	|	|   +-- BoardAdmin
	|	+-- Auth
	|	|   +-- Auth.tsx
	|	|   +-- FindPw.tsx
	|	|   +-- Registration.tsx
	|	+-- Board
	|	|   +-- Comment
	|	|   +-- Post
	|	|   +-- Search
	|	|   +-- Board.tsx
	|	|   +-- Category.tsx
	|	|   +-- NewPost.tsx
	|	+-- FAQ
	|	|   +-- Components
	|	|   |   +-- FAQItem.tsx
	|	|   +-- FAQ.tsx
	|	+-- Home
	|	|   +-- Profile
	|	|   |   +-- Funding
	|	|   |   |   +-- Accounts
	|	|   |   |   +-- P2P
	|	|   |   +-- Point
	|	|   |   +-- Share
	|	|   |   +-- Profile.tsx
	|	|   +-- Home.tsx
	|	+-- MyPage
	|	|   +-- MyPage.tsx
	|	+-- Randing
	|	|   +-- Randing.tsx
+-- App.tsx
+-- Router.tsx
+-- index.tsx
+-- react-app-env.d.ts
```

## Description

- **Components** : 재사용할 수 있는 컴포넌트 폴더

- **Interface**

  - Admin : 관리자 페이지 전용 인터페이스
  - User : 사용자의 정보 및 연동 회사, 연동 계좌, 투자, 포인트 정보 관련 인터페이스
  - Board : 게시판 카테고리, 게시글, 세부 게시글, 댓글 정보 관련 인터페이스
  - FAQ : FAQ 컴포넌트 인터페이스
  - Error : 에러 처리를 위한 인터페이스

- **Pages**

  - Admin : 사이트 관리를 위한 페이지

    - BoardAdmin / CategoryAdmin / FaqAdmin / P2PAdmin / PointAdmin / UserAdmin

  - Auth : 사용자 인증 처리를 위한 페이지

    - Auth : 로그인 기능
    - FindPw : 비밀번호 찾기 ( 재발급 기능 )
    - Registration : 회원가입 기능

  - Board : 투자자들의 소통을 위한 게시판 공간 제공 페이지

    - Board : 카테고리 별 게시판 컨테이너 및 내글 보기 페이지
    - Category : 카테고리 View 관리 페이지
    - NewPost : 새 글 CRUD 관리 페이지
    - Comment : 댓글 및 답글 CRUD 관리 페이지
      - Comment / CommentForm / CommentView

    - Post : 카테고리 별 전체 게시물 컨테이너
      - 정렬, 게시글 수 설정 가능
      - DetailPost : 세부 게시물 컴포넌트. 게시글, 댓글 및 답글 추천/비추천 기능
      - PostBox : 실제 전체 게시물 컴포넌트
    - Search : 카테고리, 검색범위, 검색어에 따른 게시물 검색 기능

  - FAQ : 자주 하는 질문을 모아 보여주는 페이지

    - 질답 확인 기능
    - FAQItem

  - Home : 사용자의 정보를 보여주는 페이지

    - Profile : 프로필 사진 변경 기능, 새로고침 기능, 로그아웃 기능
      - Funding : 투자 정보를 보여주는 탭
        - Accounts : 연동 회사 계정 수정 및 삭제 기능
        - P2P : 연동 회사 관리 및 잔고, 보유 계좌 조회 기능 
          - P2PList : 연동 회사 투자 정보 조회 기능
          - P2PRegister : 연동 회사 계정 등록 및 모아보기를 통한 계정 검색
      - Point : 포인트 정보를 보여주는 탭
        - 보유 포인트 조회 및 기간 별 포인트 상세 내역 조회 기능
        - PointList
      - Share : 친구 초대 기능을 제공하는 탭
        - 카카오톡 공유하기를 통한 친구 초대 기능

  - MyPage : 회원 탈퇴 및 비밀번호 변경 페이지

  - Randing : 서버 구동 시 첫 화면 랜딩 페이지



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

> ### 댓글 및 답글 공감/비공감 시 호출하는 API 다르게 구성하기
기존에는 댓글 OR 답글 공감/비공감이 변경되면 댓글 OR 답글의 모든 데이터를 불러오는 API를 이용했기에 **전체 댓글 창을 업데이트** 하도록 했었다. 댓글을 추가하거나 삭제하는 과정이 아니므로 굳이 전체 데이터를 가져올 필요가 없다고 판단했기에, **선택된 댓글 OR 답글의 데이터만** 가져올 수 있는 API를 만들어야할 것 같아 백에 구현을 요청하여 수정하도록 했다.
( API URL : ~/detail_comment )


> ### 답글 삭제 시, 댓글의 답글 수가 업데이트 되지 않는 문제 
답글 수정, 삭제 시 댓글의 답글 수도 함께 변경되어야 한다. 이를 효율적으로 구현하기 위해 
~/detail_comment 를 이용하려 하였다. 
답글이 수정되거나 삭제될 때에 부모 댓글의 id 정도만 저장되도록 구현되었기에 부모 댓글의 데이터는 쉽게 가져올 수 있었지만, 그 데이터를 다시 특정 부모 댓글의 데이터로 저장하여 업데이트 시키는 것이 어려웠다. 
(❌ 그냥 댓글을 다 가져오는 방법으로 구현은 해놨으나, 효율적인 방법을 찾지 못함, 미해결)

💭 현재 comment List에서 comment ID 가 같은걸 찾아서 그 comment에 데이터를 저장시켜주는 방법?

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
