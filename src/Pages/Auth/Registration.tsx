import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
import logo from '../../asset/img/logo.webp'
import React, {useState} from "react";
import { useCookies} from 'react-cookie';

// TODO: 회원가입 페이지
const useStyles = makeStyles({
     authContainer: {
          padding: "100px"
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

     },
     input: {
          margin: "8px"
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
          
          fetch('http://192.168.0.69:8000/api/auth/register', {
               method: "POST",
               headers: {
                    "Content-Type": "application/json; charset=utf-8",
               },
               body: JSON.stringify(registerInfo),	// json 데이터를 전송
          })
               .then(res => {
                    if( res.status === 201 ){
                         alert("회원가입 완료");
                         res.json().then( data => {
                              console.log(data)
                              setCookie(
                                       data.email, 
                                       data.auth_token
                              )

                         })
                    }else alert('회원가입 실패')
               })
               .catch(error =>  console.log(error));
               
          }
     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          switch(e.target.id) {
               case "firstName":
                    setFirstName(value)
                    break
               case "lastName":
                    setLastName(value)
                    break
               case "userId":
                    setId(value)
                    break
               case "email":
                    setEmail(value)
                    break
               case "password":
                    setPassword(value)
                    break
          }
     }
          return (
               <Container className={classes.authContainer} maxWidth="sm">
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
                                   id="firstName"
                                   aria-describedby="my-helper-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="my-helper-text">Enter your first name.</FormHelperText>
                              </FormControl>
                              <FormControl className={classes.input}>
                                   {/* 성 */}
                                   <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                   <Input 
                                   id="lastName"
                                   aria-describedby="my-helper-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="my-helper-text">Enter your last name.</FormHelperText>
                              </FormControl>

                              <FormControl className={classes.input}>
                                   {/* 아이디 */}
                                   <InputLabel htmlFor="firstName">ID</InputLabel>
                                   <Input 
                                   id="userId"
                                   aria-describedby="my-helper-text" 
                                   type="string" 
                                   onChange={onChange}/>
                                   <FormHelperText id="my-helper-text">Enter your ID.</FormHelperText>
                              </FormControl>

                              <FormControl className={classes.input}>
                                   {/* 이메일 */}
                                   <InputLabel htmlFor="email">Email(ID)</InputLabel>
                                   <Input 
                                   id="email"
                                   aria-describedby="my-helper-text" 
                                   type="email" 
                                   onChange={onChange}/>
                                   <FormHelperText id="my-helper-text">Enter your email.</FormHelperText>
                              </FormControl>

                              <FormControl  className={classes.input}>
                                   {/* 비밀번호*/}
                                   <InputLabel htmlFor="password">Password</InputLabel>
                                   <Input 
                                   id="password" 
                                   aria-describedby="my-helper-text" 
                                   type="password" 
                                   onChange={onChange}/>
                                   <FormHelperText id="my-helper-text">Enter your password.</FormHelperText>
                              </FormControl>
                              <div className={classes.button}>
                                   <Button type="submit" onClick={onSubmit}>함께하기</Button>
                              </div>
                         </form>
                    </div>
               </Container>
          )
}
