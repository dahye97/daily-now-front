/** @format */

import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Board from "./Pages/Board";
import Randing from "./Pages/Randing";
import Auth from "./Pages/Auth";
import Navigation from "./Components/Navigation";
import FAQ from "./Pages/FAQ";
import Registration from "./Pages/Registration";

export default function AppRouter(props: any) {
	const [isLoggedIn, setisLoggedIn] = useState(false);

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
							<Route exact path="/mypage" render=
								{() => <Home handleLogOut={handleLogOut} />}
							/>
							<Route exact path="/board" component={Board} />
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
