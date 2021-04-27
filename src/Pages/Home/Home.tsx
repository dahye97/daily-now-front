/** @format */
import {useState,useEffect} from 'react';
import { useLocation } from 'react-router';
import queryString from 'query-string'
import { makeStyles, } from "@material-ui/styles";
import { Typography,Grid,IconButton } from "@material-ui/core";
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import { p2pInfo, userInfo, accountInfo, fundInfo } from "../../Interface/User";
import Share from './Profile/Share/Share';

import Profile from "./Profile/Profile";
import P2PList from "./Profile/Funding/P2P/P2PList"
import Balance from './Profile/Funding/Balance';
import Transaction from './Profile/Funding/Transaction';
import Funding from './Profile/Funding/Funding';
import Point from './Profile/Point/Point';
import Account from './Profile/Funding/Account';
import Calendar from './Calendar';
import Product from './Product';

const useStyles = makeStyles({
	home: {
		display:"flex",
		justifyContent: "center",
		margin:" 0 auto",
		background: "linear-gradient(145deg, #ffffff, #ECF0F3)",
		minWidth: '680px',
	},
	homeContainer: {
		padding: "20px",
		marginTop: "80px",
		marginLeft: '80px',
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "17px 17px 34px #b1b1b1, -17px -17px 34px #ffffff",
		minWidth : "580px",
		overflow: "hidden",
	},
	asideContainer : {
		position: "sticky",
		top: "80px",
		marginTop: "80px",
	},
	'@media(max-width: 1270px)' : {
		asideContainer: {
 //
		},
		home: {
			display: 'block',
			width: 'fit-content',
			margin: '0 auto',
			background: '#ffffff'
		},
		homeContainer : {
			boxShadow: '#ffffff',
			marginLeft: 0
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
	},
	UpButton: {
		position: 'sticky',
		bottom: '10%',
		left: '5%',
		padding: '20px',
		color: '#ffffff',
		borderRadius: "50%",
		background: "#198BFB",
		boxShadow:  "3px 3px 8px #167add",
		'&:hover' : {
			background: '#004ba0',
		}
	}
});

interface HomeProps {
	userObj: userInfo | null,
	P2PList: Array<p2pInfo>
	handleLogOut: any,
	handleAddP2P : (data: Array<p2pInfo>) => void
}
export default function Home(props: HomeProps) {
	const classes = useStyles();
	
	const location = useLocation()
	const queryObj = queryString.parse(location.search);
	const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

	const { userObj, handleLogOut, handleAddP2P} = props;

	const [company, setCompany] = useState("all")
	const [companyID, setCompanyID] = useState(0)
	const [nickName, setNickName] = useState("")

	const [account, setAccount] = useState<accountInfo | undefined>(Object);
	const [fund, setFund] = useState<fundInfo>(Object)

	// 선택한 회사 정보 저장 
	const handleCompany = (name: string) => {
		setCompany(name);
	}
	const handleCompanyID =(id: number ) => {
		setCompanyID(id);
	}
	const handleNickName = (name: string) => {
		setNickName(name)
	}

	// 가져온 계좌, 투자 정보 저장
	const handleAccount = (account: accountInfo | undefined) => {
		setAccount(account)
	}
	const handleFund = (fund: fundInfo) => {
		setFund(fund)
	}

	const getAccountData =  (p2pID: { company_id: number, refresh: number}) => {
		console.log('getaccountdata')
		if (userObj !== null){
			fetch(`http://192.168.0.69:8000/api/${nickName}/account`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json; charset=utf-8",
								"Authorization": "Token " + userObj.auth_token,
							},
							body: JSON.stringify(p2pID),	// json 데이터를 전송
				})
					.then(res => {
						if( res.ok ){
							res.json().then( data => {
								// 유저계좌정보 저장
								handleAccount(data)
							})
						}else {
							handleAccount(undefined)
						}
					})
					.catch(error =>  console.log(error));
			}
	}

	const getBalanceData = (p2pID: { company_id: number, refresh: number}) => {

		if(userObj !== null) {
			fetch(`http://192.168.0.69:8000/api/${nickName}/balance`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json; charset=utf-8",
							"Authorization": "Token " + userObj.auth_token,
						},
						body: JSON.stringify(p2pID),	// json 데이터를 전송
			})
				.then(res => {
					if( res.ok ){
						res.json().then( data => {
							// 회사 투자정보 저장
							handleFund(data)
						})
					}else {
						handleFund({
							total_investment : "-",
							number_of_investing_products : "-",
							residual_investment_price : "-"
						})					}
				})
				.catch(error =>  console.log(error));
		}
	}
	// 선택된 회사 아이디에 따라 계좌, 투자 내역 정보 가져오기 
	const getUserDataOfCompany = (refresh: number, id?: number) => {
		let idValue = companyID;
		if(id) {
			idValue = id
		}
		let p2pID = {
			company_id : idValue,
			refresh: refresh
		};
		
		console.log('현재 company ', company)
		if (userObj !== null) {
			getAccountData(p2pID)
			getBalanceData(p2pID)
		}
	}
	useEffect(() => {
		if( companyID !== 0){
			getUserDataOfCompany(0, companyID)
		}
	}, [companyID])

	const handleClickUpButton = () => {
		window.scrollTo(0, 0);
	}

	const [scrollY, setScrollY] = useState(0)
	const handleScroll = () => {
		setScrollY(window.pageYOffset)
	}
	
	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
	}, [])
	return (
		<>
			<Grid container spacing={3} className={classes.home}>

				{/* 마이 페이지 */}
				<Grid item xs={6}>

					<div className={classes.homeContainer}>
						<Profile userObj={userObj} handleLogOut={handleLogOut} 
						companyID={companyID} getUserDataOfCompany={getUserDataOfCompany}/>

						{/* 나의투자, 포인트 내역, 초대하기 */}
						{tabName === "MY_FUNDING" ? 
						<>
							<P2PList 
							getUserDataOfCompany={getUserDataOfCompany}
							P2PList={props.P2PList} userObj={userObj} 
							handleCompanyID={handleCompanyID} handleCompany={handleCompany} 
							handleAddP2P={handleAddP2P} handleNickName={handleNickName} />
							<ul className={classes.contentList}>
			{/* 보유 예치금 */} 	<li className={classes.contentItem}>
									<Typography className={classes.deposit} variant="h5">
										💰 {company === "all"? "총" : "현"} 보유 예치금
										
										<span>{company === "all"? 0 : account?.deposit} 원</span>
									</Typography>	
								</li>
								{company !== "all" && account !== undefined ?
									<li className={classes.contentItem}><Account account={account}/></li>
								: null
								}
				{/* 잔고 */}			<li className={classes.contentItem}><Balance fund={fund}/></li>
				{/* 입출금 내역 */}	{company !== "all" && 
									<li className={classes.contentItem}><Transaction /></li>
								}
			{/* 투자 내역 관리 */}		<li className={classes.contentItem}><Funding company={company}/></li>
							</ul>
						</>						
						: tabName === "POINT_TOTAL" ? 
							<Point userObj={userObj}/>
						: tabName === "INVITE" ? 
							<Share userObj={userObj}/>
						: null}
						</div>
				</Grid>
				{ /* 사이드 바 : 월간 내역, 모집 중인 상품 리스트 */}
				<Grid item xs={3} className={classes.asideContainer}>
					<div  className={classes.asideItem}><Calendar /></div>
					<div  className={classes.asideItem}>
						<Typography variant="h5">💙 모집 중인 상품 </Typography>
						<div className={classes.productList}><Product /></div>
					</div>
				</Grid>
			</Grid>
			{tabName=="POINT_TOTAL" && ( scrollY > 500) &&
			<IconButton onClick={handleClickUpButton} className={classes.UpButton}>
				<UpIcon />
			</IconButton>}
		</>
	);
}
