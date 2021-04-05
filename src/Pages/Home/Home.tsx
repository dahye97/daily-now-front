/** @format */

import Profile from "../Home/Profile";
import P2PList from "../Home/P2PList";
import Funding from "./Funding";
import { makeStyles, } from "@material-ui/core/styles";

import { Typography,Grid } from "@material-ui/core";
import Transaction from "./Transaction";
import Product from "./Product";
import { p2pInfo, userInfo } from "../../Interface/User";
const useStyles = makeStyles({
	home: {
		display:"flex",
		justifyContent: "center",
		margin:" 0 auto",
		background: "linear-gradient(145deg, #ffffff, #ECF0F3)",

	},
	homeContainer: {
		padding: "20px",
		marginTop: "80px",
		borderRadius: "50px",
		background: "linear-gradient(100deg, #ffffff, #ECF0F3)",
		boxShadow: "17px 17px 34px #b1b1b1, -17px -17px 34px #ffffff",
		overflow: "hidden",
	},
	asideContainer : {
		width: "230px",
		height: "300px",
		
		padding: "20px",
		marginTop: "80px",
		borderRadius: "50px",
		background: "linear-gradient(100deg, #ffffff, #e6e6e6)",
		boxShadow:  "9px 9px 18px #b1b1b1, -9px -9px 18px #ffffff",
		overflow: "hidden",
		position: "sticky",
		top: "80px",

		'@media(max-width: 950px)' : {
			display:'none'
		}
	},
	productList: {
		display: "flex",
	},

	contentList: {
		paddingLeft: "0"
	},
	contentItem: {
		color: "#616161",
		listStyle: "none",
		padding:"20px",
		margin: "20px",
		borderRadius: "42px",
		background: "#ffffff",
		boxShadow:  "10px 10px 20px #bfbfbf, -10px -10px 20px #ffffff"
	}
});

interface HomeProps {
	userObj: userInfo | null,
	P2PList: Array<p2pInfo>
	handleLogOut: any,
	handleAddP2P: any
}
export default function Home(props: HomeProps) {
	const classes = useStyles();
	return (
			<Grid container spacing={3}  className={classes.home}>
				<Grid item xs={6} >
					<div className={classes.homeContainer}>
								<Profile userObj={props.userObj} handleLogOut={props.handleLogOut}/>

			{/* 투자 회사 리스트*/}	<P2PList P2PList={props.P2PList} userObj={props.userObj} handleAddP2P={props.handleAddP2P} />

								<ul className={classes.contentList}>
				{/* 현재 보유 예치금 */} <li className={classes.contentItem}>
										<Typography  variant="h5">🔥 현 보유 예치금</Typography>	
									</li>
				{/* 찜한 상품 리스트 */} <li  className={classes.contentItem} >
										<Typography variant="h5">🔥 찜한 상품 리스트 </Typography>
										<div className={classes.productList}><Product /></div>
									</li>
				{/* 투자 내역 관리 */}	<li className={classes.contentItem}><Funding /></li>
			{/* 입출금 내역 : 리스트*/}	<li className={classes.contentItem}><Transaction /></li>
								</ul>
						</div>
				</Grid>
				<Grid item xs={3}>
					<aside  className={classes.asideContainer}>
						<ul>
							<li>찜한 상품</li>
							<li>투자 내역</li>
							<li>입출금 내역</li>
						</ul>
					</aside>
				</Grid>
			</Grid>
	);
}
