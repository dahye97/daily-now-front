/** @format */
import React, {useState,useEffect} from 'react'
import { IconButton, Avatar ,Button } from "@material-ui/core";
import { makeStyles,useTheme  } from "@material-ui/core/styles";
import MobileStepper from '@material-ui/core/MobileStepper';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { p2pInfo, userInfo } from '../../Interface/User';
import P2PRegister from './P2PRegister';

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

	const handleClickAdd = () => {
		setOpen(true);
	}
	const handleClose = () => {
		setOpen(false);
	}

	const handleSubmit = (e: React.MouseEvent) => {
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	// P2PLIST Stepper
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

	const handleP2PClick = (e: React.MouseEvent) => {

		let p2pName = {
			'company_name' : e.currentTarget.textContent
		}
		if (props.userObj !== null) {
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
							console.log(data)
						})
					}else {
					
					}
				})
				.catch(error =>  console.log(error));
				
			}
		}

	return (
		<div>
		{ props.P2PList.length !== undefined && 
			<>
			<div className={classes.fundListContainer}>
				<div className={classes.fundList}>
					<IconButton className={classes.iconBody}><span><HomeIcon/><p>나의 투자</p></span></IconButton>
					{ props.P2PList.slice(P2PIndex.start,P2PIndex.end).map( (company,index) => {
							return (
								<IconButton key={index} onClick={handleP2PClick}>
									<span className={classes.iconBody}>
										<Avatar/>
										<p>{company.company_name}</p>
									</span>
								</IconButton>)
					})}
					<IconButton><AddIcon onClick={handleClickAdd} style={{fontSize: "40px"}}/></IconButton>
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
			<P2PRegister open={open} isError={isError} handleClose={handleClose} handleChange={handleChange} handleSubmit={handleSubmit}/>
			</>
			}
		</div>
		);
}
