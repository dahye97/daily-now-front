import React, {useState,useEffect} from 'react'
import { Collapse, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button,Select,MenuItem,Input } from "@material-ui/core";
import {Autocomplete, Alert, AlertTitle } from '@material-ui/lab';
import {userInfo}from 'Interface/User'
import { makeStyles } from "@material-ui/core/styles";
import { companyInfo } from './P2PList';
import axios from 'axios'

interface P2PRegisterProps {
     userObj : userInfo | null,
     open: boolean,// 폼 오픈 여부

     handleClose: () => void, // 폼 닫기
     handleP2PUpdated : () => void, // 회사 추가 여부 
     getAllCompany: () => void, // 회사 id fetch

     allCompany: Array<companyInfo>
     handleChangeAllCompany: (company: companyInfo[]) => void
     getUserDataOfCompany : (refresh: number, id?: number) => void
}

const useStyles = makeStyles({
	p2pField: {
          display: "flex",
          justifyContent: "space-evenly"
     },

});

export default function P2PRegister(props: P2PRegisterProps) {
     const classes = useStyles();
     const { userObj, handleClose, open, handleP2PUpdated, allCompany, getUserDataOfCompany } = props;

     // INPUT
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")

     const [P2PId, setP2PId] = useState(0)
	const [P2PName, setP2PName] = useState("")

     const [isRegistrationError, setRegistrationError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
     const [isAuthError, setAuthError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
     
     const [isAuthentic, setIsAuthentic] = useState(false)
     // 연동 회사 등록 폼 input 핸들러
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
	
     // 연동 회사 등록 함수 
	const handleSubmit = (e: React.MouseEvent) => {
          e.preventDefault();

          const p2pInfo = {
               "username":userName,
               "user_password":password,
               "company_id": P2PId
          }

          if(isAuthentic){

               if(props.userObj !== null ) {
                    fetch(`${process.env.REACT_APP_SERVER}/api/register/company_register`, {
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
                                             setRegistrationError({
                                                  open: true,
                                                  isTrue : false,
                                                  message: ""
                                             })
                                             console.log('등록완료!')
                                             getUserDataOfCompany(1, P2PId)
                                             handleP2PUpdated()
                                             handleClose()
     
                                        }else {
                                             setRegistrationError({
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
          }else {
               alert('회원 인증을 먼저 해주세요.')
          }
          }

     const handleAuth = () => {
          if( userObj !== null ) {
               axios.post(`${process.env.REACT_APP_SERVER}/api/${P2PName}/is_valid`, {
                    id : userName,
                    pwd: password
               },{
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               }).then(res => {
                      if( res.status === 200){

                         setAuthError({
                              open: true,
                              isTrue : false,
                              message: "인증되었습니다."
                         })
                         setIsAuthentic(true)
                      } 
               })
               .catch(function(error) {
                    setAuthError({
                         open: true,
                         isTrue : true,
                         message: "유효하지 않은 회원입니다. 다시 시도해주세요."
                    })
                    initializeForm()
               })
          }
     }
     const initializeForm = () => {
          setUserName('')
          setPassword('')
          setP2PName('')
          setValue(null)
          setInputValue('')
          setFilteredCompany([])
     }
     // 폼 초기화 핸들러 함수
     useEffect(() => {
          // 폼이 닫혀있을 때만 초기화
          if( !open ) {
               initializeForm()
          }
          if( !open && isAuthError.open || isRegistrationError.open ) {
               setAuthError({
                    open: false,
                    isTrue: false,
                    message: ''
               })
               setRegistrationError({
                    open: false,
                    isTrue: false,
                    message: ''
               })
               setIsAuthentic(false)
          }
     }, [open,isAuthError,isRegistrationError ])
     

     const [value, setValue] = useState<string | null>();
     const [inputValue, setInputValue] = useState('');

     // 회사 검색 결과 핸들러 함수
     const [filteredCompany, setFilteredCompany] = useState<companyInfo[]>([])
     useEffect(() => {
          if(value !== null && typeof(value) === 'string'){
               console.log(allCompany)
               setFilteredCompany(allCompany.filter( company => {
                    return company.company_name.includes(value)
               }))

               let company = [{
                    id: 0,
                    company_name: '',
                    nickname: ''
               }]
               company = allCompany.filter(company => value === company.company_name)
               if(company.length !== 0){
                    setP2PId( company[0].id )
                    setP2PName( company[0].nickname)
               }
          }
     }
     , [value])

     return (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">연동 회사 등록</DialogTitle>
               <Collapse in={isRegistrationError.open}>
                    <Alert  
                         severity={ isRegistrationError.isTrue ? "error":"success"}>
                         <AlertTitle>등록 { isRegistrationError.isTrue ? "실패" : "성공"}</AlertTitle>
                         <strong>{isRegistrationError.message}</strong>
                    </Alert>
               </Collapse> 
               <Collapse in={isAuthError.open}>
                    <Alert  
                         severity={ isAuthError.isTrue ? "error":"success"}>
                         <AlertTitle>인증 { isAuthError.isTrue ? "실패" : "성공"}</AlertTitle>
                         <strong>{isAuthError.message}</strong>
                    </Alert>
               </Collapse> 
               <DialogContent>
                    <DialogContentText>
                    연동할 회사와 회원 ID, 패스워드를 입력해주세요.
                    </DialogContentText>
                    <Autocomplete
                         id="company-search"
                         value={value}
                         onChange={(event: any, newValue: string | null) => {
                              setValue(newValue);
                         }}
                         options={(value === null ? allCompany : filteredCompany).map((company) => company.company_name)}
                         renderInput={(params: any) => (
                              <TextField {...params} label="연동할 회사" margin="normal" variant="outlined" />
                         )}
                         inputValue={inputValue}
                         onInputChange={(event, newInputValue) => {
                              setInputValue(newInputValue)
                         }}
                         />
                    <TextField onChange={handleChange} value={userName} id="email" label="Email(ID)" type="email" fullWidth/>
                    <TextField onChange={handleChange} value={password} id="password" label="Password" type="password" fullWidth/>
                    <Button onClick={handleAuth}>회원 인증</Button>
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
