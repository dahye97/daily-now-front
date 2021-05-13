/** @format */
import {useState,useEffect} from 'react';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string'
import { makeStyles, } from "@material-ui/styles";
import { Typography,Grid,IconButton } from "@material-ui/core";
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import { p2pInfo, userInfo, accountInfo, fundInfo } from "Interface/User";
import Share from 'Pages/Home/Profile/Share/Share';
import Profile from "Pages/Home/Profile/Profile";
import P2PList from "Pages/Home/Profile/Funding/P2P/P2PList"
import Balance from 'Pages/Home/Profile/Funding/Balance';
import Point from 'Pages/Home/Profile/Point/Point';
import BankAccount from 'Pages/Home/Profile/Funding/BankAccount';
import UserAccount from './Profile/Funding/Accounts/UserAccount';

const useStyles = makeStyles({
	home: {
		display:"flex",
		justifyContent: "center",
		margin:" 0 auto",
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
	registeredP2PList: p2pInfo[]
	handleLogOut: () => void,
	handleAddP2P : (data: p2pInfo[]) => void,

	isP2PReady: boolean
}
export default function Home(props: HomeProps) {
	const classes = useStyles();
	
	const location = useLocation()
	const queryObj = queryString.parse(location.search);
	const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

	const { userObj, handleLogOut, handleAddP2P, registeredP2PList, isP2PReady} = props;

	const [company, setCompany] = useState("all")
	const [companyID, setCompanyID] = useState(0)
	const [nickName, setNickName] = useState("")

	const [account, setAccount] = useState<accountInfo | undefined>(Object);
	const [fund, setFund] = useState<fundInfo>(Object)

	const [isHomeRefresh, setIsHomeRefresh] = useState(false)
	// 선택한 회사 정보 저장 
	const handleCompany = (name: string) => {
		if( name === "all") setIsHomeRefresh(!isHomeRefresh)
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
	
	// 선택된 회사 아이디에 따라 계좌, 투자 내역 정보 가져오기 
	const getAccountData =  (p2pID: { company_id: number, refresh: number}) => {
		if (userObj !== null){
			fetch(`${process.env.REACT_APP_SERVER}/api/${nickName}/account`, {
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
					.catch(error =>  console.log('계좌 정보가 없습니다.'));
			}
	}
	const getBalanceData = (p2pID: { company_id: number, refresh: number}) => {

		if(userObj !== null) {
			fetch(`${process.env.REACT_APP_SERVER}/api/${nickName}/balance`, {
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
						})					
					}
				})
				.catch(error =>  console.log('투자 정보가 없습니다.'));
		}
	}
	const getUserDataOfCompany = (refresh: number, id?: number) => {
		let idValue = companyID;
		if(id) {
			idValue = id
		}
		let p2pID = {
			company_id : idValue,
			refresh: refresh
		};
		
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

	// 위로가기 기능 
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

	// 연동 회사 추가 시 업데이트 state 
	const [P2PUpdated, setP2PUpdated] = useState(false)
	const handleP2PUpdated = () => {
		setP2PUpdated(!P2PUpdated)
	}

	// 연동 회사 추가 시 업데이트 할 수 있게 하는 핸들러
	useEffect(() => {
		if(userObj !== null){
			fetch(`${process.env.REACT_APP_SERVER}/api/register/registered_company`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Authorization": "Token " + userObj.auth_token
				},
			}).then((res) => res.json())
			.then((res) => {
				console.log('등록된 계정 리스트: ', res)
				handleAddP2P(res)
			})
			.catch(error =>  console.log(error));
		}
	},[P2PUpdated])

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
							P2PList={registeredP2PList} userObj={userObj} 
							handleCompanyID={handleCompanyID} handleCompany={handleCompany} 
							handleAddP2P={handleAddP2P} handleNickName={handleNickName} 
							handleP2PUpdated={handleP2PUpdated}
							/>

							{isP2PReady ? // 연동 회사가 존재할 때
							
								company === "all" // 현재 위치 : HOME 
								?
								<div style={{padding: '20px', marginTop: '20px'}}>
									<Typography variant="h5" style={{textAlign:'center', color: '#616161'}}>
										DAILY NOW
									</Typography>
									<p style={{ textAlign:'center', color: '#616161', fontSize:'15px'}}>
										💁🏻‍♀️ 아이디나 비밀번호가 변경되었을 경우, 회사 검색을 통해 업데이트 해주세요. 
									</p>
									<UserAccount 
										isHomeRefresh={isHomeRefresh}
										userObj={userObj} 
										allAccounts={registeredP2PList}
										handleP2PUpdated={handleP2PUpdated} />
									
								</div>
								: // 현재 위치 : 특정 P2P 회사 
									<ul className={classes.contentList}>
										<h2 style={{textAlign: 'center'}}>{company !== "all" && `🏬 ${company}`}</h2>
										{account !== undefined // 보유 계좌가 있을 때
										? 
										<>
						{/* 보유 예치금 */} 	<li className={classes.contentItem}>
												<Typography className={classes.deposit} variant="h5">
													💰 현 보유 예치금<span>{account?.deposit} 원</span>
												</Typography>
											</li>
											<li className={classes.contentItem}><BankAccount account={account}/></li>
							{/* 잔고  */}		<li className={classes.contentItem}><Balance fund={fund}/></li>
										</>
										: <div style={{textAlign: 'center', color: '#616161'}}>보유하신 계좌가 존재하지 않습니다.</div>
									}
								</ul>
							: // 연동한 회사가 존재하지 않을 때
								<div style={{textAlign:'center', color: '#616161', marginTop: '10px'}}>회사를 연동해주세요!</div>
							}
							
						</>
												
						: tabName === "POINT_TOTAL" ? 
							<Point userObj={userObj}/>
						: tabName === "INVITE" ? 
							<Share userObj={userObj}/>
						: null}
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
