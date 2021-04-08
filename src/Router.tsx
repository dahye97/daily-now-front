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
	}
});
export default function AppRouter() {
	const classes = useStyles()
	const [isLoggedIn, setisLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState<userInfo | null>(Object)
	const [P2PList, setP2PList] = useState<Array<p2pInfo>>(Object)

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
	
	const handleAddP2P = ( data: Array<p2pInfo>) => {
		setP2PList(data)
	}

	useEffect(() => {
		console.log(P2PList)
	}, [P2PList])
	return (
	
	<BrowserRouter>
			<Navigation isLoggedIn={isLoggedIn} />
			<Switch>
				<div className={classes.routeContainer}>
					{isLoggedIn ?
						<>
							<Route exact path="/" component={Randing} />
							<Route exact path="/home" render=
								{() => <Home handleLogOut={handleLogOut} handleAddP2P={handleAddP2P} userObj={userObj} P2PList={P2PList}/>}
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
