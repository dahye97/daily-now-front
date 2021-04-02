### Front & Back Issue 🔥
1. CORS, (Unsupported Media Type) : 또 CORS에러 🤬 

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

2. 사용자의 고유키 저장 및 교환

- 프론트와 백은 고유키(토큰)을 이용하여 유저를 인증할 수 있다. 
대표적으로 쿠키, 세션/로컬 스토리지가 존재한다. 이번 프로젝트에선 쿠키를 이용하며, 백에서 보내준 Auth_token 값을 set cookie로 저장하며 이를 헤더로 request 하여 백에게 유저를 인증할 수 있다. 

### We learned 🤷‍♀️
POSTMAN 등의 도구를 통하여 백엔드의 서버와 잘 통신이 되고 있는지, 백엔드에서 원하는 데이터 형태는 무엇인지 잘 확인해야 한다.
각자 보내줄 데이터의 형식과 이름이 제대로 통일되어 있지 않으면 데이터를 원하는 곳에 주거나 받아올 수 없다. 이 과정에서 백엔드와의 원활한 의사소통은 필수!

### React 
* react-router
- React Router로 렌더링하는 컴포넌트에 prop 전달하기 : router의 컴포넌트를 설정할때 props까지 같이 보내주고 싶을 때 `render`를 사용한다.
```
<Route exact path="/mypage" render={() => <Home handleLogOut={handleLogOut} />} />
```

* url을 변경하고 싶을 땐, `history`와 `document.location.href`를 사용할 수 있다.

### Material-UI
* styles
- makeStyles

### Typescript 
* `typescript import image cannot find module`
- `index.d.ts` 파일을 생성하여 `declare module '*.png'`를 추가해준다.

🚀 About Project

- 