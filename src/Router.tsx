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
export default function AppRouter() {
	const [isLoggedIn, setisLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState<userInfo | null>(Object)
	const [P2PList, setP2PList] = useState<p2pInfo | null>(Object)

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
	useEffect(() => {
		console.log('현재 로그인한 유저 정보', userObj)
	}, [userObj])

	const handleLogOut = () => {
		setisLoggedIn(false);
		setUserObj(null)
		document.location.href="/";
	}
	
	const handleAddP2P = ( data: p2pInfo) => {
		console.log(data)
		setP2PList(data)
	}
	
	return (
	
	<BrowserRouter>
			<Navigation isLoggedIn={isLoggedIn} />
			<Switch>
				<div className="route-container">
					{isLoggedIn ?
						<>
							<Route exact path="/" component={Randing} />
							<Route exact path="/home" render=
								{() => <Home handleLogOut={handleLogOut} handleAddP2P={handleAddP2P} userObj={userObj}/>}
							/>
							<Route exact path="/board" component={Board} />
							<Route exact path="/mypage"render=
								{() => <MyPage handleWithdrawal={handleLogOut} userObj={userObj} />}
							/>
						</>
					: 
					<Route exact path="/" component={Randing} />}
					
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
