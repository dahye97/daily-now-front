import React, {useState,useEffect} from 'react'
import { Collapse, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {userInfo}from '../../Interface/User'
import { makeStyles } from "@material-ui/core/styles";

interface P2PRegisterProps {
     userObj : userInfo | null,
     open: boolean,// 폼 오픈 여부
     isExist: boolean, // 회사 인증 여부 

     handleClose: any, // 폼 닫기
     handleP2PUpdated : any, // 회사 추가 여부 
     fetchP2PID: any, // 회사 id fetch
     P2PID: number 
}

const useStyles = makeStyles({
	p2pField: {
          display: "flex",
          justifyContent: "space-evenly"
     },

});

export default function P2PRegister(props: P2PRegisterProps) {
     const classes = useStyles();
     const { handleClose, open, fetchP2PID, handleP2PUpdated, userObj,isExist,P2PID } = props;

     // INPUT
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [P2PName, setP2PName] = useState("")

     const [isError, setError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
     // 연동 회사 등록 폼 인풋 핸들러
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
	
	const handleSubmit = (e: React.MouseEvent) => {
          e.preventDefault();
		console.log('handleSubmit')

          if ( isExist ) {
               const p2pInfo = {
                    "username":userName,
                    "user_password":password,
                    "company_id": P2PID
               }
     
               if(props.userObj !== null ) {
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
                                        if ( data[0] === "Information registration completed!") {
                                             setError({
                                                  open: false,
                                                  isTrue : false,
                                                  message: ""
                                             })
                                             handleP2PUpdated(true)
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
          } else {
               alert('먼저 회사 인증을 해주세요.')
          }
	}

     // 회사 존재 유무 확인, 있으면 아이디 저장 
     const handleClickAuth = () => {
          if(userObj !== null && P2PName.length !== 0){
               fetchP2PID(P2PName); // company id result
          }
     }

     useEffect(() => {
          if( isExist ) {
               console.log('회사 존재')
               console.log(P2PID, P2PName)
          }
          else {
               console.log('회사 없음')
          }
     }, [isExist])

     useEffect(() => {
          setUserName('')
          setPassword('')
          setP2PName('')
     }, [open])
     
     return (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                    <div className={classes.p2pField}>
                         <TextField onChange={handleChange} autoFocus margin="dense" id="p2pName" label="회사 이름" type="string"/>
                         <Button onClick={handleClickAuth} variant="outlined" color="primary">{isExist? "인증완료" : "확인"}</Button>
                    </div>
                    <TextField onChange={handleChange} autoFocus margin="dense" id="email" label="Email(ID)" type="email" fullWidth/>
                    <TextField onChange={handleChange} autoFocus margin="dense" id="password" label="Password" type="password" fullWidth/>
               </DialogContent>
               <DialogActions>
                    <Button type="submit" onClick={handleSubmit} color="primary">
                    등록
                    </Button>
                    <Button onClick={handleClose} color="primary">
                    취소
                    </Button>
               </DialogActions>
		</Dialog>
     )
}
