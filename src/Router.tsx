/** @format */

import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Board from "./Pages/Board/Board";
import Randing from "./Pages/Randing/Randing";
import Auth from "./Pages/Auth/Auth";
import FAQ from "./Pages/FAQ/FAQ";
import Registration from "./Pages/Auth/Registration";
import MyPage from "./Pages/MyPage/MyPage";
import Navigation from "./Components/Navigation";

export default function AppRouter(props: any) {
	const [isLoggedIn, setisLoggedIn] = useState(true);

	const handleLogOut = () => {
		setisLoggedIn(false);
		document.location.href="/";
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
								{() => <Home handleLogOut={handleLogOut} />}
							/>
							<Route exact path="/board" component={Board} />
							<Route exact path="/mypage" component={MyPage} />
						</>
					: <Route exact path="/" component={Randing} />}
					
					<Route exact path="/auth" component={Auth} />
					<Route exact path="/registration" component={Registration} />
					<Route exact path="/faq" component={FAQ} />

				</div>
			</Switch>
		</BrowserRouter>
	);
}
