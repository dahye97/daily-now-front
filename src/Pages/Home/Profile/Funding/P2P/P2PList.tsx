/** @format */
import React, {useState,useEffect} from 'react'
import { IconButton, Avatar  } from "@material-ui/core";
import { makeStyles  } from "@material-ui/styles";
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from "@material-ui/icons/Home";
import { p2pInfo, userInfo } from 'Interface/User'
import P2PRegister from './P2PRegister';
import Stepper from 'Components/Stepper';

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
		width: '83px',
		maxHeight:'80px'
	},
});

interface FundListProps {
	handleCompanyID : (id: number) => void,
	handleCompany : (name: string) => void,
	handleAddP2P : (data: Array<p2pInfo>) => void,
	handleNickName : (name: string ) => void
	getUserDataOfCompany : (refresh: number, id?: number) => void,
	userObj : userInfo | null,
	P2PList: Array<p2pInfo>,
	handleP2PUpdated : () => void, // 회사 추가 여부 
}

// 회사 id를 가져오기 위한 회사 정보 인터페이스 
export interface companyInfo {
     id : number,
     company_name: string,
	nickname: string
}

export default function FundList(props: FundListProps) {
	const classes = useStyles()
	const {handleCompanyID, handleCompany, handleNickName, handleP2PUpdated, userObj, P2PList, getUserDataOfCompany} = props;
	// STATE
	const [open, setOpen] = useState(false)

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

	// 회사 선택 시, 회사 이름과 id 보내기  
	const onP2PClick = (company: p2pInfo | string | null) => {
		//name: string | null
		console.log(company)
		if (company !== null){
			if (typeof(company) === "string") {
				if( company === "HOME") {
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
		fetch(`${process.env.REACT_APP_SERVER}/api/register/company`, {
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
						<div><HomeIcon style={{fontSize:'40px'}}/><p>HOME</p></div>
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
			getUserDataOfCompany = {getUserDataOfCompany}
			allCompany ={allCompany}
			handleChangeAllCompany={handleChangeAllCompany}
			handleP2PUpdated={handleP2PUpdated}
			userObj={userObj} open={open} 
			getAllCompany={getAllCompany} 
			handleClose={handleClose}/>
			</>
			}
		</div>
		);
}
