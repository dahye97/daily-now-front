/** @format */

import Profile from "../Home/Profile";
import P2PList from "../Home/P2PList";
import Funding from "./Funding";
import { makeStyles, } from "@material-ui/core/styles";

import { Container,Typography } from "@material-ui/core";
import Transaction from "./Transaction";
import Product from "./Product";
import { userInfo } from "../../Interface/User";
const useStyles = makeStyles({
	homeContainer: {
		padding: "20px",
		marginTop: "80px",
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "17px 17px 34px #b1b1b1, -17px -17px 34px #ffffff",
		overflow: "hidden",
	},
	productList: {
		display: "flex",
	}
});

interface HomeProps {
	userObj: userInfo | null
	handleLogOut: any,
	handleAddP2P: any
}
export default function Home(props: HomeProps) {
	const classes = useStyles();
	return (
		<Container className={classes.homeContainer} maxWidth="md">
			{/* Grid */}
			<Profile userObj={props.userObj} handleLogOut={props.handleLogOut}/>

{/* 투자 회사 리스트*/}	<P2PList userObj={props.userObj} handleAddP2P={props.handleAddP2P} />
{/* 현재 보유 예치금 */} <div> <Typography variant="h5">🔥 현 보유 예치금</Typography> </div>
{/* 찜한 상품 리스트 */} <div>
						<Typography variant="h5">🔥 찜한 상품 리스트 </Typography>
						<div className={classes.productList}>
							<Product />
							<Product />
						</div>
						
					</div>
{/* 투자 내역 관리 */}	<Funding />
	{/* 전체 투자 내역*/}
	{/* 상세 투자 내역*/}
		
{/* 입출금 내역 : 리스트*/}<Transaction />
	{/* 월간 투자 내역 : 달력 ( 입금 : 파랑, 출금 : 빨강 )*/}
			
		</Container>
	);
}
