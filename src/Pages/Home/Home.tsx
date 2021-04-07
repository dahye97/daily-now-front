/** @format */
import {useState,useEffect} from 'react';
import Profile from "../Home/Profile";
import P2PList from "../Home/P2PList";
import Funding from "./Funding";
import { makeStyles, } from "@material-ui/core/styles";

import { Typography,Grid } from "@material-ui/core";
import Transaction from "./Transaction";
import Product from "./Product";
import { p2pInfo, userInfo, accountInfo, fundInfo } from "../../Interface/User";
import Account from '../MyPage/Account';

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
		minWidth : "580px",
		overflow: "hidden",

	},
	asideContainer : {
		position: "sticky",
		top: "80px",
		marginTop: "80px",

		'@media(max-width: 1270px)' : {
			display:'none'
		}
	},
	asideItem : {
		padding: "30px",
		minWidth : "500px",
		marginBottom: "20px",
		borderRadius: "50px",
		
		background: "linear-gradient(100deg, #ffffff, #e6e6e6)",
		boxShadow:  "9px 9px 18px #b1b1b1, -9px -9px 18px #ffffff",
		overflow: "hidden",

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
	},
	deposit: {
		display: "flex",
		justifyContent: "space-between"
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
	const [company, setCompany] = useState("all")
	const [account, setAccount] = useState<accountInfo | undefined>(Object);
	const [fund, setFund] = useState<fundInfo[]>([])

	// p2plist에서 선택한 회사 정보 저장 
	const handleClickP2P = (name: string) => {
			setCompany(name);
	}
	useEffect(() => {
		let p2pName = {
			'company_name' : company
		};
		
		if (props.userObj !== null && company !== "all") {
			fetch('http://192.168.0.69:8000/api/company/account', {
						method: "POST",
						headers: {
							"Content-Type": "application/json; charset=utf-8",
							"Authorization": "Token " + props.userObj.auth_token,
						},
						body: JSON.stringify(p2pName),	// json 데이터를 전송
			})
				.then(res => {
					if( res.ok ){
						res.json().then( data => {
							// 유저계좌정보 저장
							setAccount(data)
						})
					}else {
						alert('계좌 정보가 없습니다.')
					}
				})
				.catch(error =>  console.log(error));
		
			fetch('http://192.168.0.69:8000/api/company/balance', {
						method: "POST",
						headers: {
							"Content-Type": "application/json; charset=utf-8",
							"Authorization": "Token " + props.userObj.auth_token,
						},
						body: JSON.stringify(p2pName),	// json 데이터를 전송
			})
				.then(res => {
					if( res.ok ){
						res.json().then( data => {
							// 회사 투자정보 저장
							setFund(data)
						})
					}else {
						alert('투자 정보가 없습니다.')
					}
				})
				.catch(error =>  console.log(error));
		}
	}, [company])

	return (
			<Grid container spacing={3}  className={classes.home}>

				{/* TODO 메인 홈 : 마이 페이지 [ 총 투자내역, 상세 투자내역, 보유 예치금 등 ] */}
				<Grid item xs={6} >
					<div className={classes.homeContainer}>

						<Profile userObj={props.userObj} handleLogOut={props.handleLogOut}/>
						<P2PList P2PList={props.P2PList} userObj={props.userObj} handleClickP2P={handleClickP2P} handleAddP2P={props.handleAddP2P} />

						<ul className={classes.contentList}>
		{/* 보유 예치금 */} 	<li className={classes.contentItem}>
								<Typography className={classes.deposit} variant="h5">
									💰 {company === "all"? "총" : "현"} 보유 예치금
									
									<span>{company === "all"? 0 : account?.deposit} 원</span>
								</Typography>	
							</li>
							{company !== "all" && account !== undefined ?
								<li className={classes.contentItem}>
									<Account account={account}/>
								</li>
							: null
							}
		{/* 투자 내역 관리 */}	<li className={classes.contentItem}>
								<Funding company={company} fund={fund}/>
							</li>
							{company !== "all" && 
								<li className={classes.contentItem}>
			{/* 입출금 내역 */}			<Typography  variant="h5">📋 입출금 내역</Typography>	
								</li>
							}
							
						</ul>

						</div>
				</Grid>
				{ /* TODO 사이드 바 : 월간 내역, 모집 중인 상품 리스트 */}
				<Grid item xs={3} direction="column" className={classes.asideContainer}>
					<div  className={classes.asideItem}>
						<Transaction />
					</div>
					<div  className={classes.asideItem}>
						<Typography variant="h5">💙 모집 중인 상품 </Typography>
						<div className={classes.productList}><Product /></div>
					</div>
				</Grid>
				
			</Grid>
	);
}
