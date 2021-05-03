import React, {useState,useEffect} from 'react'
import { Collapse, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button,Select,MenuItem,Input } from "@material-ui/core";
import {Autocomplete, Alert, AlertTitle } from '@material-ui/lab';
import {userInfo}from 'Interface/User'
import { makeStyles } from "@material-ui/core/styles";
import { companyInfo } from './P2PList';

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
     const { handleClose, open, handleP2PUpdated, allCompany, getUserDataOfCompany } = props;

     // INPUT
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")

     const [P2PId, setP2PId] = useState(0)
	const [P2PName, setP2PName] = useState("")

     const [isError, setError] = useState({
		open: false,
		isTrue: false,
		message: ""
	})
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
                                        console.log('등록완료!')
                                        getUserDataOfCompany(1, P2PId)
                                        handleP2PUpdated()
                                        handleClose()

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

     // 폼 초기화 핸들러 함수
     useEffect(() => {
          setUserName('')
          setPassword('')
          setP2PName('')
          setValue(null)
          setInputValue('')
          setFilteredCompany([])
     }, [open])
     

     const [value, setValue] = useState<string | null>();
     const [inputValue, setInputValue] = useState('');

     // 회사 검색 결과 핸들러 함수
     const [filteredCompany, setFilteredCompany] = useState<companyInfo[]>([])
     useEffect(() => {
          console.log(value, inputValue, filteredCompany)
          if(value !== null && typeof(value) === 'string'){
               setFilteredCompany(allCompany.filter( company => {
                    return company.company_name.includes(value)
               }))

               let company = [{
                    id: 0,
                    company_name: ''
               }]
               company = allCompany.filter(company => value === company.company_name)
               if(company.length !== 0){
                    setP2PId( company[0].id )
               }
          }
     }
     , [value])

     return (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">연동 회사 등록</DialogTitle>
               <Collapse in={isError.isTrue}>
                    <Alert  
                         severity={ isError.isTrue ? "error":"success"}>
                         <AlertTitle>등록 { isError.isTrue ? "실패" : "성공"}</AlertTitle>
                         <strong>{isError.message}</strong>
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
