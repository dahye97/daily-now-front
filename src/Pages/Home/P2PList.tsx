/** @format */
import React, {useState,useEffect} from 'react'
import HomeIcon from "@material-ui/icons/Home";
import { IconButton, Avatar,Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button } from "@material-ui/core";
import {Collapse} from '@material-ui/core'
import { makeStyles,useTheme  } from "@material-ui/core/styles";
import { Alert, AlertTitle } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { p2pInfo, userInfo } from '../../Interface/User';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

// TODO: 투자 P2P 회사 리스트 
const useStyles = makeStyles({
	root: {
		maxWidth: 400,
		flexGrow: 1,
		background : "none"
	   },
	fundListContainer: {

	},
	fundList: {
		margin: "10px 0",
		padding: "10px 0",
		display:"flex",
		// alignItems: "sp"
	},
	iconBody: {
		fontSize: "12px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	stepper : {
		borderBottom: "1px solid #e0e0e0",
		display:"flex",
		justifyContent: "center"
	}
});

interface FundListProps {
	handleAddP2P : any,
	userObj : userInfo | null,
	P2PList: Array<p2pInfo>
}

export default function FundList(props: FundListProps) {
	const classes = useStyles()

	// STATE
	const [open, setOpen] = useState(false)
	const [isError, setError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
	const [P2PUpdated, setP2PUpdated] = useState(false)

	// INPUT
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [P2PName, setP2PName] = useState("")
	
	// INDEX
	const [P2PIndex, setP2PIndex] = useState({
		start : 0,
		end : 5
	})

	const onClickAdd = () => {
		setOpen(true);
	}
	const onClose = () => {
		setOpen(false);
	}

	const onSubmit = (e: React.MouseEvent) => {
          e.preventDefault();

          const p2pInfo = {
               "username":userName,
			"user_password":password,
			"company_name":P2PName
          }

		if (props.userObj !== null) {
			fetch('http://192.168.0.69:8000/api/register/company_register', {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Authorization": "Token " + props.userObj.auth_token
				},
				body: JSON.stringify(p2pInfo),
			})
				.then(res => {
					if(res.ok) {
						res.json().then( data => {
							console.log(data)
							if ( data[0] === "Information registration completed!") {
								setError({
									open: false,
									isTrue : false,
									message: ""
								})
								setP2PUpdated(true)
							}else {
								setError({
									open: true,
									isTrue : true,
									message: data
								})
							}
						})
					}
				})
				.catch(error =>  console.log(error));
		}
     }

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          switch(e.target.id) {
               case "p2pName":
                    setP2PName(value)
                    break
               case "email":
                    setUserName(value)
                    break
               case "password":
                    setPassword(value)
                    break
          }
     }
	
	useEffect(() => {
			if(props.userObj !== null){
				fetch('http://192.168.0.69:8000/api/register/registered_company', {
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						"Authorization": "Token " + props.userObj.auth_token
					},
				}).then((res) => res.json())
				.then((res) => {
					props.handleAddP2P(res)
				})
				.catch(error =>  console.log(error));
			}
	},[P2PUpdated])

	const theme = useTheme();
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
	  setActiveStep((prevActiveStep) => prevActiveStep + 1);
	  setP2PIndex( {
		  start : P2PIndex.end,
		  end : P2PIndex.end + 4
	  })
	};
   
	const handleBack = () => {
	  setActiveStep((prevActiveStep) => prevActiveStep - 1);
	  setP2PIndex( {
		start : P2PIndex.start - 4,
		end : P2PIndex.start
	})
	};

	useEffect(() => {
		console.log(P2PIndex)
	}, [P2PIndex])
		return (
			<div>
			{ props.P2PList.length !== undefined && 
				<>
				<div className={classes.fundListContainer}>
					<div className={classes.fundList}>
						<IconButton className={classes.iconBody}>
							<span>
								<HomeIcon/>
								<p>나의 투자</p>
							</span>
						</IconButton>
						{ 
							props.P2PList.slice(P2PIndex.start,P2PIndex.end).map( (company,index) => {
									return (
										<IconButton key={index}>
											<span className={classes.iconBody}>
												<Avatar/>
												<p>{company.company_name}</p>
											</span>
										</IconButton>)
								})}
						<IconButton>
							<AddIcon onClick={onClickAdd} style={{fontSize: "40px"}}/>
						</IconButton>
					</div>
					<div className={classes.stepper}>
							<MobileStepper
								variant="dots"
								steps={Math.floor(props.P2PList.length / 5 + 1)}
								position="static"
								activeStep={activeStep}
								className={classes.root}
								nextButton={
								<Button size="small" onClick={handleNext} disabled={activeStep === Math.floor(props.P2PList.length / 5)}>
									{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
								</Button>
								}
								backButton={
								<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
									{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
								</Button>
								}
							/>
					</div>
				</div>

					<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">P2P 회사 등록</DialogTitle>
						<Collapse in={isError.isTrue}>
							<Alert  
								severity={ isError.isTrue ? "error":"success"}>
								<AlertTitle>등록 { isError.isTrue ? "실패" : "성공"}</AlertTitle>
								<strong>{isError.message}</strong>
							</Alert>
						</Collapse>
						<DialogContent>
							<DialogContentText>
							연동할 회사의 이름과 회원 ID, 패스워드를 입력해주세요.
							</DialogContentText>
							<TextField onChange={onChange} autoFocus margin="dense" id="p2pName" label="회사 이름" type="string" fullWidth/>
							<TextField onChange={onChange} autoFocus margin="dense" id="email" label="Email(ID)" type="email" fullWidth/>
							<TextField onChange={onChange} autoFocus margin="dense" id="password" label="Password" type="password" fullWidth/>
						</DialogContent>
						<DialogActions>
							<Button type="submit" onClick={onSubmit} color="primary">
							등록
							</Button>
							<Button onClick={onClose} color="primary">
							취소
							</Button>
						</DialogActions>
					</Dialog>
				</>
				}
			</div>
			);
}
