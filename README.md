### Front & Back Issue 🔥
> 1. CORS, (Unsupported Media Type) : 또 CORS에러 🤬 

- POST 으로 서버에 폼을 제출할 때, 헤더에 **Content-type을 서버와 동일하게 설정**해주어야 한다.
- 데이터를 전송할 땐, `JSON.stringfy`를 통해 **json 형태의 데이터로 전송**해야한다. 
- mode를 no-cors로 해두면 cors에 의해 원하는 데이터를 얻지 못하고 비어있는 데이터를 받게 된다.
  no-cors 모드의 목적이 아무에게나 cors 요청을 허용하는 것이 아니기 때문이다.
```
 fetch('http://192.168.0.69:8000/api/auth/register', {
               method: 'POST',
               // mode: 'no-cors',
               headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json; charset=utf-8",
               },
               body: JSON.stringify(registerInfo)	// json 데이터를 전송
               })
               .then(res => console.log(res))
               .catch(error =>  console.log(error));
```

> 2. 사용자의 고유키 저장 및 교환

- 프론트와 백은 고유키(토큰)을 이용하여 유저를 인증할 수 있다. 
대표적으로 쿠키, 세션/로컬 스토리지가 존재한다. 이번 프로젝트에선 쿠키를 이용하며, 백에서 보내준 Auth_token 값을 set cookie로 저장하며 이를 헤더로 request 하여 백에게 유저를 인증할 수 있다. 

> 3. request header로 고유키 전송

⚠ 헤더로 토큰을 전송해주는데 자꾸 다음과 같은 에러가 발생
`Request header field auth_token is not allowed by Access-Control-Allow-Headers in preflight response.`

💭 헤더에 보내는 auth_token이라는 필드가 허용되지 않는다. 처음엔 백에서 필드를 허용해줘야 한다 생각하여 백쪽 `Access-Control-Allow-Headers` 에 필드를 추가했지만 해결 x

🤦‍♀️ 토큰 키를 주고 받으며 인증하기 위해선 `authorization` 필드를 사용하며, 
`'Authorization': '[name] ' + [token value]` 다음과 같은 구조로 헤더에 추가해주어야 한다. 

> 4. 내가 작성한 글/댓글/공감 수정, 삭제, 취소

✅ 내가 작성한 글 or 댓글에만 수정, 삭제 버튼을 렌더링 해주기 위해 리스트 API는 클라이언트로부터 받은 토큰 정보를 통해 게시물에 대한 권한을 확인하여야 한다. 권한이 확인되면 response 를 통해 프론트에 게시물에 대한 정보와 함께 권한을 확인할 수 있는 정보를 포함하여 전달한다. 

📌 게시물 리스트는 로그인하지 않은 사람도 볼 수 있어야하기 때문에 토큰이 전송될 때와 전송되지 않을 경우 2가지를 고려하여 구현되어야한다. 

```
[
  {
    id: 1,
    title: '첫번째 게시글'
    editable: false
  },
  {
    id: 2,
    title: '두번째 게시글'
    editable: true // -----> true 일 경우 수정/삭제 가능한 게시글
  },
]
```

> 5. 공감, 비공감 저장 및 취소와 그에 따른 아이콘 색 변경 처리 

✅ 서버에서 받은 게시물 상세 데이터의 `like_dislike`의 값 (0 or 1)에 따라 초기 아이콘의 색을 초기화 해주기 위해 useEffect를 이용한다. (206~)

✅ `iconButton`의 `className`은 `pressableLike`과 `pressableDislike`에 따라 조건처리 될 수 있도록 하여 **색을 바꾸기 위해** 선언하였다. 

✅  `iconButton`을 클릭할 경우 `handleLikeDisLike`을 실행한다.

✔ `like_dislike`값이 `1`일 경우 = 공감을 한 상태
- 공감을 다시 눌렀을 경우, 취소 처리
- 비공감을 눌렀을 경우, "이미 공감을 했다" 는 문구를 띄운다.

✔ `like_dislike`값이 `0`일 경우 = 비공감을 한 상태
- 비공감을 다시 눌렀을 경우, 취소 처리
- 공감을 눌렀을 경우, "이미 비공감을 했다" 는 문구를 띄운다.

✔ `like_dislike`값이 `-1`일 경우 = 공감/비공감 모두 선택 가능
- 공감/비공감 add 처리
- 공감/비공감을 할 경우, `setPressableLike(true)`/`setPressableDislike(true)`를 통해 `className`을 변경하여 색 변경 처리


### We learned 🤷‍♀️
POSTMAN 등의 도구를 통하여 백엔드의 서버와 잘 통신이 되고 있는지, 백엔드에서 원하는 데이터 형태는 무엇인지 잘 확인해야 한다.
각자 보내줄 데이터의 형식과 이름이 제대로 통일되어 있지 않으면 데이터를 원하는 곳에 주거나 받아올 수 없다. 이 과정에서 백엔드와의 원활한 의사소통은 필수!

### React 
> react-router
- React Router로 렌더링하는 컴포넌트에 prop 전달하기 : router의 컴포넌트를 설정할때 props까지 같이 보내주고 싶을 때 `render`를 사용한다.
```
<Route exact path="/mypage" render={() => <Home handleLogOut={handleLogOut} />} />
```

* url을 변경하고 싶을 땐, `history`와 `document.location.href`를 사용할 수 있다.

* 동일 컴포넌트 내에서 페이지를 렌더링 해주고 싶을 때, 두 path를 한 컴포넌트에 할당하고, 컴포넌트에 props를 추가해주어 컴포넌트 내로 들어오는 props 값에 따라 렌더링 해줄 수 있다!
```
    <Route 
    exact path="/board" 
    render={() => (
      <Board typeNum={"01"} typeName="게시판" />
    )}
    />
    <Route 
    exact path="/board/write" 
    render={() => (
      <Board typeNum={"02"} typeName="글쓰기"/>
    )}/>
```
### Material-UI
* styles
- makeStyles

### Typescript 
* `typescript import image cannot find module`
- `index.d.ts` 파일을 생성하여 `declare module '*.png'`를 추가해준다.

🚀 About Project

- Front : React, Typescript
- Back : Django, MySQL
- CSS : Material-UI, useStyles

- 쿠키를 통해 유저 고유키(Token) 저장
- axios 를 통해 서버와 GET, POST 통신