/** @format */

import { AppBar, Button, makeStyles, Toolbar } from "@material-ui/core";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import logo from "../asset/img/logo_white.png";
const useStyles = makeStyles({
	appbar: {
		background: "#198BFB",
	},
	logo: {
		maxWidth: "185px",
		position: "absolute",
		top: "10px",
		left: "30px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "flex-end",

		'& a' : {
			textDecoration : 'none',
			color: "#ffffff",
			marginRight: '10px'
		}
	},
});
interface NavProps {
	isLoggedIn: boolean;
}
export default function Navigation(props: NavProps) {
	const history = useHistory();
	const classes = useStyles();

	return (
		<header>
			<AppBar position="fixed" className={classes.appbar}>
				<Toolbar className={classes.toolbar}>
					<Link to="/">
						<img 
						src={logo} 
						alt="데일리나우와 함께해요!" 
						className={classes.logo} />
					</Link>
					<div>
						<Link to="/board">커뮤니티</Link>
						<Link to="/faq">FAQ</Link>
						{props.isLoggedIn ? (
							<Link to="/home?tabName=MY_FUNDING">마이페이지</Link>
						) : (
							<>
								<Link to="/auth">로그인</Link>
								<Link to="/registration?share=FALSE">회원가입</Link>
							</>
						)}
					</div>
				</Toolbar>
			</AppBar>
		</header>
	);
}
