/** @format */
import React, {useState,useEffect} from 'react'
import { IconButton, Avatar  } from "@material-ui/core";
import { makeStyles  } from "@material-ui/styles";
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from "@material-ui/icons/Home";
import { p2pInfo, userInfo } from '../../../../../Interface/User'
import P2PRegister from './P2PRegister';
import Stepper from '../../../../../Components/Stepper';

// TODO: 투자 P2P 회사 리스트 
const useStyles = makeStyles({
	fundListContainer: {

	},
	fundList: {
		margin: "10px 0",
		padding: "10px 0",
		display:"flex",
	
	},
	iconBody: {
		fontSize: "12px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: '80px'
	},
});

interface FundListProps {
	handleCompanyID : (id: number) => void,
	handleCompany : (name: string) => void,
	handleAddP2P : (data: Array<p2pInfo>) => void,
	handleNickName : (name: string ) => void
	userObj : userInfo | null,
	P2PList: Array<p2pInfo>
}

// 회사 id를 가져오기 위한 회사 정보 인터페이스 
export interface companyInfo {
     id : number,
     company_name: string
}

export default function FundList(props: FundListProps) {
	const classes = useStyles()
	const {handleCompanyID, handleCompany, handleNickName, handleAddP2P, userObj, P2PList} = props;
	// STATE
	const [open, setOpen] = useState(false)
	const [P2PUpdated, setP2PUpdated] = useState(false)
	const [P2PID, setP2PID] = useState(0)

     const [isExist, setIsExist] = useState(false)

	// INDEX
	const [P2PIndex, setP2PIndex] = useState({
		start : 0,
		end : 5
	})

	// 연동 회사 폼 여닫이 핸들러 
	const handleClickAdd = () => {
		getAllCompany()
	}
	const handleClose = () => {
		setOpen(false);
		setIsExist(false)
	}	
	const handleP2PUpdated = () => {
		setP2PUpdated(!P2PUpdated)
	}

	// 연동 회사 추가 시 홈에 알릴 수 있게 하는 핸들러 
	useEffect(() => {
			if(userObj !== null){
				fetch('http://192.168.0.69:8000/api/register/registered_company', {
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						"Authorization": "Token " + userObj.auth_token
					},
				}).then((res) => res.json())
				.then((res) => {
					console.log('p2pupdated: ', res)
					handleAddP2P(res)
				})
				.catch(error =>  console.log(error));
			}
	},[P2PUpdated])

	// 회사 선택 시, 회사 이름과 id 보내기  
	const onP2PClick = (company: p2pInfo | string | null) => {
		//name: string | null
		if (company !== null){
			if (typeof(company) === "string") {
				if( company === "모든 투자") {
					handleCompany("all")
				}
			}else{ 
				handleCompanyID(company.company_id)
				handleCompany(company.company_name)
				handleNickName(company.nickname)
			}
		}
	}

	const [allCompany, setAllCompany] = useState<companyInfo[]>([])
	const getAllCompany = () => {
		fetch('http://192.168.0.69:8000/api/register/company', {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		}).then(res => {
			if(res.ok) {
				res.json().then( companies => {
					setAllCompany(companies)
					setOpen(true);
				})
			}
		})
	}
	const handleChangeAllCompany = (company: companyInfo[]) => {
		setAllCompany(company)
	}

	const handleP2PIndex = (startValue:number, endValue: number ) => {
		setP2PIndex( {
               start : startValue,
               end :endValue
          })
	}

	return (
		<div>
		{ P2PList.length !== undefined && 
			<>
			<div className={classes.fundListContainer}>
				<div className={classes.fundList}>
					<IconButton 
					onClick={(e) => onP2PClick(e.currentTarget.textContent)} 
					className={classes.iconBody}>
						<span><HomeIcon fontSize="large"/><p>모든 투자</p></span>
					</IconButton>

					{ P2PList.slice(P2PIndex.start,P2PIndex.end).map( (company,index) => {
						return (
							<IconButton style={{padding: 0}} key={index} onClick={() => onP2PClick(company)}>
								<div className={classes.iconBody}>
									<Avatar/>
									<p>{company.company_name}</p>
								</div>
							</IconButton>)
					})}
					<IconButton onClick={handleClickAdd} >
						<AddIcon style={{fontSize: "40px"}}/>
					</IconButton>
				</div>

				<Stepper index={P2PIndex} steps={P2PList.length / 5 + 1} handleP2PIndex={handleP2PIndex}/>
			</div>
			<P2PRegister 
			allCompany ={allCompany}
			handleChangeAllCompany={handleChangeAllCompany}
			P2PID={P2PID} 
			handleP2PUpdated={handleP2PUpdated}
			userObj={userObj} open={open} 
			getAllCompany={getAllCompany} 
			handleClose={handleClose}/>
			</>
			}
		</div>
		);
}
