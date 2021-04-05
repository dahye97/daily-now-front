import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
import logo from '../../asset/img/logo.webp'
import React, {useState,useEffect} from "react";
import { useCookies} from 'react-cookie';
import { useHistory } from "react-router";
import {errorInfo} from '../../Interface/Error';

// TODO: 회원가입 페이지
const useStyles = makeStyles({
     authContainer: {
          padding: "100px",
     },
     authBox: {
		padding: "20px",
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "13px 13px 34px #b1b1b1, -13px -13px 34px #ffffff",
		overflow: "hidden",
          textAlign: "center",
	},
     registerForm : {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
     },
     input: {
          margin: "8px",
          maxWidth: "195px"
     },
     button : {
          marginTop: "20px"
     }
})
export default function Registration() {
     const classes = useStyles()

     const [firstName, setFirstName] = useState("")
     const [lastName, setLastName] = useState("")
     const [id, setId] = useState("")
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")

     const [error, setError] = useState<errorInfo | undefined>(Object);

     useEffect(() => {
          console.log(error)
     }, [error])
     const history = useHistory();
     const [cookies, setCookie, removeCookie] = useCookies([]);

     const onSubmit = (e: React.MouseEvent) => {
          e.preventDefault();

          const registerInfo = {
               "username": id,
               "email": email,
               "password": password,
               "first_name": firstName,
               "last_name": lastName
          }
          console.log(registerInfo)
          fetch('http://192.168.0.69:8000/api/auth/register', {
               method: "POST",
               headers: {
                    "Content-Type": "application/json; charset=utf-8",
               },
               body: JSON.stringify(registerInfo),	// json 데이터를 전송
          })
               .then(res => {
                    if( res.ok ){
                         alert("회원가입 완료 :) 다시 로그인 해주세요.");
                         history.push("/")
                         res.json().then( data => {
                              setCookie(
                                       data.email, 
                                       data.auth_token
                              )
                         })
                    }else {
                         res.json().then( data => {
                              setError(data)
                              for( let elem in data ){
                                   document.getElementById(elem)?.setAttribute('error', "")
                              }
                         }
                         )
                         alert('회원가입 실패')
                    }
               })
               .catch(error =>  console.log(error));
               
          }
     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          switch(e.target.id) {
               case "firstNameInput":
                    setFirstName(value)
                    break
               case "lastNameInput":
                    setLastName(value)
                    break
               case "userIdInput":
                    setId(value)
                    break
               case "emailInput":
                    setEmail(value)
                    break
               case "passwordInput":
                    setPassword(value)
                    break
          }
     }
          return (
               <Container className={classes.authContainer} maxWidth="md">
                    <div className={classes.authBox}>
                         <img src={logo} width="80px"/>
                         <h2>Daily Check ✔</h2>
                         <p>매일이 행복한 투자<br/>
                         <b>데일리펀딩이</b> 함께 합니다</p>

                         <form className={classes.registerForm}>
                              <FormControl className={classes.input}>
                                   {/* 이름 */}
                                   <InputLabel htmlFor="firstName">First Name</InputLabel>
                                   <Input 
                                   id="firstNameInput"
                                   aria-describedby="firstName-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="firstName-text">Enter your first name.</FormHelperText>
                              </FormControl>
                              <FormControl className={classes.input}>
                                   {/* 성 */}
                                   <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                   <Input 
                                   id="lastNameInput"
                                   aria-describedby="lastName-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="lastName-text">Enter your last name.</FormHelperText>
                              </FormControl>

                              <FormControl error={error && (error.username? true : undefined)} id="username"className={classes.input}>
                                   {/* 아이디 */}
                                   <InputLabel htmlFor="firstName">ID</InputLabel>
                                   <Input 
                                   id="userIdInput"
                                   aria-describedby="userId-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="userId-text">
                                        {error && (error.username? error.username : "Enter your ID")}
                                   </FormHelperText>
                              </FormControl>

                              <FormControl error={error && (error.email? true : undefined)}id="email" className={classes.input}>
                                   {/* 이메일 */}
                                   <InputLabel htmlFor="email">Email(ID)</InputLabel>
                                   <Input 
                                   id="emailInput"
                                   aria-describedby="email-text" 
                                   type="email" 
                                   onChange={onChange}/>
                                   <FormHelperText id="email-text" className="email-text">
                                        {error && (error.email? error.email : "Enter your email")}
                                   </FormHelperText>
                              </FormControl>

                              <FormControl  error={error && (error.password? true : undefined)} id="password"  className={classes.input}>
                                   {/* 비밀번호*/}
                                   <InputLabel htmlFor="password">Password</InputLabel>
                                   <Input 
                                   id="passwordInput" 
                                   aria-describedby="password-text" 
                                   type="password" 
                                   onChange={onChange}/>
                                   <FormHelperText id="password-text" className="password-text">
                                        {error && (error.password? error.password : "Enter your password")}
                                   </FormHelperText>
                              </FormControl>
                              <div className={classes.button}>
                                   <Button type="submit" onClick={onSubmit}>함께하기</Button>
                              </div>
                         </form>
                    </div>
               </Container>
          )
}
