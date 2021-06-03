/** @format */
import { useState,useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";
import Home from "Pages/Home/Home";
import Board from "Pages/Board/Board";
import Randing from "Pages/Randing/Randing";
import Auth from "Pages/Auth/Auth";
import FAQ from "Pages/FAQ/FAQ";
import Registration from "Pages/Auth/Registration";
import MyPage from "Pages/MyPage/MyPage";
import Navigation from "Components/Navigation";
import {p2pInfo, userInfo} from 'Interface/User';
import { makeStyles, } from "@material-ui/styles";
import Admin from "Pages/Admin/Admin";
import { NOTFOUND } from "node:dns";
import AdminNav from "Pages/Admin/AdminNav";

const useStyles = makeStyles({
	routeContainer : {
		// display:"flex"
		height: '100%'
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
	const [isP2PReady, setIsP2PReady] = useState(false)
	const [userObj, setUserObj] = useState<userInfo | null>(null)
	const [P2PList, setP2PList] = useState<p2pInfo[]>([])

	const [isAdmin, setIsAdmin] = useState(false)

	const handleIsAdmin = (value: boolean) => {
		setIsAdmin(value)
	}
	// 로그인 함수 
	const handleLogIn = ( data: userInfo) => {
		// console.log(data)
		setisLoggedIn(true);
		setUserObj( {
			"email" : data.email,
			"username": data.username,
			"auth_token" : data.auth_token
		})	
	}

	// 로그아웃 함수 
	const handleLogOut = () => {
		setisLoggedIn(false);
		setUserObj(null)
		document.location.href="/";
		window.sessionStorage.clear();

		handleIsAdmin(false)
	}
	
	// 연동 회사 리스트 저장 함수 
	const handleAddP2P = ( data: Array<p2pInfo>) => {
		setP2PList(data)
	}

	useEffect(() => {
		// console.log('현재 로그인한 유저 정보', userObj)
		if( userObj === null){
			const email = window.sessionStorage.getItem('email');
			const auth_token = window.sessionStorage.getItem('auth_token');
			const name = window.sessionStorage.getItem('username');
			const isAdmin = window.sessionStorage.getItem('isAdmin');
			if(email && auth_token ) {
				const data = {
					"email": email,
					"username": name,
					"auth_token": auth_token
				}
				handleLogIn(data)
				if(isAdmin === "true") handleIsAdmin(true)
				else handleIsAdmin(false)
			}
		}

	}, [])

	useEffect(() => {
		if(P2PList.length !== 0) {
			setIsP2PReady(true)
		}
	}, [P2PList])

	return (
	
	<BrowserRouter>
			{/* 어드민 페이지로 가면 admin nav를 사용하도록한다.  */}
			<Switch>
				<>
				{/* <div className={classes.routeContainer}> */}
					{  window.location.pathname !== "/admin" &&
						<Navigation 
							isAdmin={isAdmin}
							isLoggedIn={isLoggedIn} 
							handleLogOut={handleLogOut} 
						/>
					}
					{isLoggedIn ?
						<>
							<Route path="/home" 
							render={() => 
								<Home 
									isP2PReady={isP2PReady} 
									handleLogOut={handleLogOut} 
									handleAddP2P={handleAddP2P} 
									userObj={userObj} 
									registeredP2PList={P2PList}/>}
							/>
						
							<Route exact path="/mypage"
							render={() => 
								<MyPage handleWithdrawal={handleLogOut} userObj={userObj} />}
							/>
							<Route 
							exact path="/admin" 
							render={() => (
								<Admin isAdmin={isAdmin} userObj={userObj}/>
							)}
							/>
						</>
						:
						<>
							<Route exact path="/auth" render={
								() => <Auth handleIsAdmin={handleIsAdmin} handleLogIn={handleLogIn} typeNum={"01"} typeName="로그인" /> }
							/>
							<Route exact path="/auth/find_pw" render={
								() => <Auth handleIsAdmin={handleIsAdmin} handleLogIn={handleLogIn} typeNum={"02"} typeName="비밀번호 찾기" /> }
							/>
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
						<Board userObj={userObj} typeNum={"03"} typeName="글수정"/>
					)}/>
					<Route
					exact path="/board/category=:categoryId/detail/:postId" 
					render={() => (
						<Board userObj={userObj} typeNum={"04"} typeName="게시물"/>
					)}/>
					<Route path="/registration" component={Registration} />
					<Route exact path="/faq" component={FAQ} />
				{/* </div> */}
				</>
			</Switch>
		</BrowserRouter>
	);
}
