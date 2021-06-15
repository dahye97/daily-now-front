import axios from 'axios'
import React, {useState,useEffect} from 'react'

import { Collapse, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button} from "@material-ui/core";
import {Autocomplete, Alert, AlertTitle } from '@material-ui/lab';

import { p2pInfo, userInfo } from 'Interface/User'
import AccountItem from './Components/AccountItem';

interface AccountItemProps {
     allAccounts: p2pInfo[]
     userObj : userInfo | null,
     handleP2PUpdated : () => void, // 회사 추가 여부 
     isHomeRefresh: boolean
}
export default function UserAccount(props: AccountItemProps) {
     const { allAccounts,userObj,handleP2PUpdated,isHomeRefresh } = props;
     
     // 회사 검색 결과 핸들러 함수
     const [value, setValue] = useState<string | null>(null);

     const [filteredCompany, setFilteredCompany] = useState<p2pInfo[]>([])
     useEffect(() => {
          if(value !== null && typeof(value) === 'string'){
               setFilteredCompany(allAccounts.filter( company => {
                    return company.company_name.includes(value)
               }))
          }
     }
     , [value])

     // 수정하려는 회사명, 수정창 토글
     const [open, setOpen] = React.useState(false);
     const [editingCompany, setEditingCompany] = useState<p2pInfo>()

     const handleClickOpen = (company : p2pInfo) => {
          setEditingCompany(company)
          setOpen(true);
     };
     const handleClose = () => {
       setOpen(false);
     };

     // 수정하려는 아이디, 비밀번호 
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          switch(e.target.id) {
               case "email":
                    setUserName(value)
                    break
               case "password":
                    setPassword(value)
                    break
          }
     }

     // 회원 인증 에러 처리 함수
     const [isAuthentic, setIsAuthentic] = useState(false)
     const [isAuthError, setAuthError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
     const handleAuth = () => {
          if( userObj !== null && userName && password ) {
               axios.post(`${process.env.REACT_APP_SERVER}/api/${editingCompany?.nickname}/is_valid`, {
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
                    setUserName('')
                    setPassword('')
               })
          } else {
               alert('잘못된 입력입니다. 정확히 작성해주세요.')
          }
     }
     
     // 연동 계정 정보 변경 함수
     const handleSubmit = () => {
          // 입력한 아이디 or 비밀번호
          let data;
          if (userName && password ) {
               console.log(userName,password)
               data = {
                    company_id : editingCompany?.company_id,
                    username : userName,
                    user_password: password
               }
          } else {
               if(userName) {
                    data = {
                         company_id : editingCompany?.company_id,
                         username : userName,
                    }
               }else {
                    data = {
                         company_id : editingCompany?.company_id,
                         user_password: password
                    }
               }
          }

          if( userObj !== null && isAuthentic ) {
               axios.post(`${process.env.REACT_APP_SERVER}/api/register/company_update`, 
                    data,
               {
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               }).then(res => {
                         alert('변경이 완료되었습니다.')
                         handleP2PUpdated()
                         handleClose()
                    })
               .catch(function(error) {
               console.log(error)
               })
          }else {
               alert('회원 인증을 먼저 해주세요.')
          }
     }

     useEffect(() => {
          setValue(null)
     }, [isHomeRefresh])
     return (
          <div>
                <Autocomplete
                         id="account-search"
                         value={value}
                         onChange={(event: any, newValue: string | null) => {
                              setValue(newValue);
                         }}
                         options={(value === null ? allAccounts : filteredCompany).map((company) => company.company_name)}
                         renderInput={(params: any) => (
                              <TextField {...params} label="회사명을 검색해주세요." margin="normal" variant="outlined" />
                         )}
                    />
               <div>
                    {(value === null ? allAccounts : filteredCompany).map( account => {
                         return ( <AccountItem 
                              key={account.company_id} 
                              userObj={userObj} 
                              accountInfo={account}
                              handleP2PUpdated={handleP2PUpdated} 
                              handleClickOpen={handleClickOpen}/> )
                    })}
               </div>
               <Dialog
               open={open}
               onClose={handleClose}
               aria-labelledby="alert-dialog-slide-title"
               aria-describedby="alert-dialog-slide-description"
               >
               <DialogTitle id="alert-dialog-slide-title">{"회원 정보 변경"}</DialogTitle>

               <Collapse in={isAuthError.open}>
                    <Alert  
                         severity={ isAuthError.isTrue ? "error":"success"}>
                         <AlertTitle>인증 { isAuthError.isTrue ? "실패" : "성공"}</AlertTitle>
                         <strong>{isAuthError.message}</strong>
                    </Alert>
               </Collapse> 

               <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                         변경하시려는 아이디나 비밀번호를 입력해주세요.
                    </DialogContentText>
                    <TextField onChange={handleChange} type="email" label="Email(ID)" id="email" value={userName} fullWidth/>
                    <TextField onChange={handleChange} type="password" label="Password" id="password" value={password} fullWidth/>
                    {/* 비밀번호보기옵션 */}
                    <Button style={{display:'block', margin:'0 auto'}} onClick={handleAuth} color="primary">회원 인증 (필수)</Button>
               </DialogContent>
               <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                    저장
                    </Button>
                    <Button onClick={handleClose} color="primary">
                    취소
                    </Button>
               </DialogActions>
               </Dialog>
          </div>
     )
}
