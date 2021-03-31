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