/** @format */
import {useState,useEffect} from 'react'
import HomeIcon from "@material-ui/icons/Home";
import { IconButton, Avatar,Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button } from "@material-ui/core";
import dailyfunding from "../../asset/img/dailyfunding.png"

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import { p2pInfo, userInfo } from '../../Interface/User';

// TODO: 투자 P2P 회사 리스트 
const useStyles = makeStyles({
	fundList: {
		margin: "10px 0",
		padding: "10px 0",
		borderBottom: "1px solid #e0e0e0",
	},
	iconBody: {
		fontSize: "12px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},

});

interface FundListProps {
	handleAddP2P : any,
	userObj : userInfo | null,
	P2PList: Array<p2pInfo>
}

export default function FundList(props: FundListProps) {
	const classes = useStyles()

	const [open, setOpen] = useState(false)
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [P2PName, setP2PName] = useState("")

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
          console.log(p2pInfo)
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
							alert(data)
							props.handleAddP2P(data)
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
		console.log('useEffect')
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
	},[])
		return (
			<div className={classes.fundList}>
				<div>
					<IconButton>
						<span className={classes.iconBody}>
							<HomeIcon fontSize="large" />
							<p>나의 투자</p>
						</span>
					</IconButton>

					{ props.P2PList.length !== 0 ?
						(props.P2PList.map( (company,index) => {
							return (
								<IconButton key={index}>
									<span className={classes.iconBody}>
										<Avatar/>
										<p>{company.company_name}</p>
									</span>
								</IconButton>)
						})) 
						: null
					}
					
					<IconButton>
						<AddIcon onClick={onClickAdd} style={{fontSize: "40px"}}/>
					</IconButton>
				</div>

					<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">P2P 회사 등록</DialogTitle>
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
			</div>
		);
}
