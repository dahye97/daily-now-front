/** @format */
import { useState,useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Board from "./Pages/Board/Board";
import Randing from "./Pages/Randing/Randing";
import Auth from "./Pages/Auth/Auth";
import FAQ from "./Pages/FAQ/FAQ";
import Registration from "./Pages/Auth/Registration";
import MyPage from "./Pages/MyPage/MyPage";
import Navigation from "./Components/Navigation";
import {p2pInfo, userInfo} from './Interface/User';
import { makeStyles, } from "@material-ui/core/styles";

const useStyles = makeStyles({
	routeContainer : {
		// display:"flex"
	},
	boardContainer : {
			padding: "20px",
			marginTop: "80px",
			marginBottom: "80px",
			borderRadius: "50px",
			background: "#ffffff",
			boxShadow: "0 5px 15px #b1b1b1, 0 5px 15px #ffffff",
			minWidth : "580px",
			overflow: "hidden",
		},
		
});
export default function AppRouter() {
	const classes = useStyles()
	const [isLoggedIn, setisLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState<userInfo | null>(null)
	const [P2PList, setP2PList] = useState<Array<p2pInfo>>(Object)

	// 로그인 함수 
	const handleLogIn = ( data: userInfo) => {
		console.log(data)
		setisLoggedIn(true);
		setUserObj( {
			"email" : data.email,
			"id": data.id,
			"first_name": data.first_name,
			"last_name": data.last_name,
			"auth_token" : data.auth_token
		})	
	}
	// 로그아웃 함수 
	const handleLogOut = () => {
		setisLoggedIn(false);
		setUserObj(null)
		document.location.href="/";
	}
	
	// 연동 회사 리스트 저장 함수 
	const handleAddP2P = ( data: Array<p2pInfo>) => {
		setP2PList(data)
	}

	useEffect(() => {
		console.log('현재 로그인한 유저 정보', userObj)
	}, [userObj])

	return (
	
	<BrowserRouter>
			<Navigation isLoggedIn={isLoggedIn} />
			<Switch>
				<div className={classes.routeContainer}>
					{isLoggedIn &&
						<>
							<Route path="/home" render=
								{() => <Home handleLogOut={handleLogOut} handleAddP2P={handleAddP2P} userObj={userObj} P2PList={P2PList}/>}
							/>
						
							<Route exact path="/mypage"render=
								{() => <MyPage handleWithdrawal={handleLogOut} userObj={userObj} />}
							/>
	{/* 동일 컴포넌트 내에서 페이지를 이동하고 싶을때, typeNum 과같은 props를 추가하여 board 내부에서 props 에 따라 렌더링해주도록 한다! */}
						</>
					}
					<Route exact path="/" component={Randing} />
					<Route 
					exact path="/board" 
					render={() => (
						<Board userObj={userObj} typeNum={"01"} typeName="게시판" />
					)}
					/>
					<Route 
					exact path="/board/write" 
					render={() => (
						<Board userObj={userObj} typeNum={"02"} typeName="글쓰기"/>
					)}/>
					<Route 
					exact path="/board/write/:postId" 
					render={() => (
						<Board userObj={userObj} typeNum={"03"} typeName="글쓰기"/>
					)}/>
					<Route
					exact path="/board/detail/:postId" 
					render={() => (
						<Board userObj={userObj} typeNum={"04"} typeName="게시물"/>
					)}/>
					
					<Route exact path="/auth" render={
						() => <Auth handleLogIn={handleLogIn}/> }
					/>
					<Route exact path="/registration" component={Registration} />
					<Route exact path="/faq" component={FAQ} />
				</div>
			</Switch>
		</BrowserRouter>
	);
}
