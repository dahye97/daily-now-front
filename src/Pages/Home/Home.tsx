/** @format */
import {useState,useEffect} from 'react';
import Profile from "./Components/Funding/Profile";
import P2PList from "./Components/Funding/P2P/P2PList"
import { makeStyles, } from "@material-ui/styles";

import { Typography,Grid,IconButton } from "@material-ui/core";
import Calendar from "./Components/Calendar";
import Product from "./Components/Product";
import { p2pInfo, userInfo, accountInfo, fundInfo } from "../../Interface/User";
import Account from '../MyPage/Account';
import { useLocation } from 'react-router';
import queryString from 'query-string'
import Share from './Components/Share/Share';
import Point from './Components/Point/Point';
import Balance from './Components/Funding/Balance';
import Transaction from './Components/Funding/Transaction';
import Funding from './Components/Funding/Funding';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

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
		asideContainer : {
			display:'none'
		},
		home: {
			display: 'block',
			width: 'fit-content',
			margin: '0 auto',
			background: '#ffffff'
		},
		homeContainer : {
			boxShadow: '#ffffff'
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
		left: 0,
		padding: '20px',
		background: '#ffffff'
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

	// p2plist에서 선택한 회사 정보 저장 
	const handleCompany = (name: string) => {
		setCompany(name);
	}
	const handleCompanyID =(id: number ) => {
		setCompanyID(id);
	}
	const handleNickName = (name: string) => {
		setNickName(name)
	}
	// 선택된 회사 아이디에 따라 계좌, 투자 내역 정보 가져오기 
	useEffect(() => {
		let p2pID = {
			'company_id' : companyID
		};
		
		if (userObj !== null && company !== "all") {
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
							setAccount(data)
						})
					}else {
						console.log('계좌 정보가 없습니다.')
						setAccount(undefined)
					}
				})
				.catch(error =>  console.log(error));
		
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
							setFund(data)
						})
					}else {
						console.log('투자 정보가 없습니다.')
						setFund({
							total_investment : "-",
							number_of_investing_products : "-",
							residual_investment_price : "-"
						})
					}
				})
				.catch(error =>  console.log(error));
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
			<Grid container spacing={3} className={classes.home}>

				{/* 마이 페이지 */}
				<Grid item xs={6}>

					<div className={classes.homeContainer}>
						<Profile userObj={userObj} handleLogOut={handleLogOut}/>
						{/* 나의투자, 포인트 내역, 초대하기 */}
						{tabName === "MY_FUNDING" ? 
							<>
							<P2PList 
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
									<li className={classes.contentItem}>
										<Account account={account}/>
									</li>
								: null
								}
								<li className={classes.contentItem}>
				{/* 잔고 */}			<Balance fund={fund}/>
								</li>

								{company !== "all" && 
									<li className={classes.contentItem}>
				{/* 입출금 내역 */}			<Transaction />
									</li>
								}
			{/* 투자 내역 관리 */}	<li className={classes.contentItem}>
									<Funding company={company}/>
								</li>
								
								
							</ul>
							</>						
						: tabName === "POINT_TOTAL" ? 
							<Point userObj={userObj}/>
						: tabName === "INVITE" ? 
							<Share userObj={userObj}/>
						: null}
						</div>
						{tabName=="POINT_TOTAL" && ( scrollY > 0) &&
						<IconButton onClick={handleClickUpButton} className={classes.UpButton}>
							<UpIcon />
						</IconButton>}
				</Grid>
				{ /* 사이드 바 : 월간 내역, 모집 중인 상품 리스트 */}
				<Grid item xs={3} direction="column" className={classes.asideContainer}>
					<div  className={classes.asideItem}>
						<Calendar />
					</div>
					<div  className={classes.asideItem}>
						<Typography variant="h5">💙 모집 중인 상품 </Typography>
						<div className={classes.productList}><Product /></div>
					</div>
				</Grid>
				
			</Grid>
	);
}
