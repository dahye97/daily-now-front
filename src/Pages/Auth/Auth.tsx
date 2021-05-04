import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
import logo from 'asset/img/logo.webp'
import { useHistory } from 'react-router';
import { userInfo } from 'Interface/User';

// TODO: 로그인 페이지 

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
     input: {
          margin: "8px"
     },
     button : {
          marginTop: "20px"
     }
});

interface AuthProps {
     handleLogIn : ( data: userInfo ) => void
}
export default function Auth (Props:AuthProps) {
     const classes = useStyles()
     const history = useHistory();
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")

     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (e.target.id === "email") {
               setEmail(value)
          }else setPassword(value)
     }
     const onSubmit = (e: React.MouseEvent) => {
          e.preventDefault();
     
          const loginInfo = {
              "email" : email,
              "password" : password
          }

          fetch(`${process.env.REACT_APP_SERVER}/api/auth/login`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json; charset=utf-8",
               },
               body: JSON.stringify(loginInfo),	// json 데이터를 전송
          })
               .then(res => {
                    res.json().then( data => {
                         if(res.ok) {
                                   Props.handleLogIn(data)
                                   alert("로그인 되었습니다.");
                                   history.push("/")
                              
                         }else {
                              alert('존재하지 않는 회원입니다.')
                              // setEmail(" ")
                              // setPassword(" ")                              
                         }
                    })
               })
               .catch(error =>  console.log(error));
               
          }
     return (
               <Container className={classes.authContainer} maxWidth="sm">
                    <div className={classes.authBox}>
                         <img src={logo} width="80px" alt="데일리나우와 함께해요!"/>
                         <h2>Daily Now 💙</h2>
                         <p>매일이 행복한 투자<br/>
                         <b>데일리펀딩이</b> 함께 합니다</p>

                         <form>
                              <FormControl className={classes.input}>
                                   {/* 이메일 */}
                                   <InputLabel htmlFor="email">Email(ID)</InputLabel>
                                   <Input onChange={onChange} id="email"aria-describedby="my-helper-text" type="email"/>
                                   <FormHelperText id="my-helper-text">Enter your email.</FormHelperText>
                              </FormControl>
                              <FormControl  className={classes.input}>
                                   {/* 비밀번호*/}
                                   <InputLabel htmlFor="password">Password</InputLabel>
                                   <Input onChange={onChange}  id="password" aria-describedby="my-helper-text" type="password"/>
                                   <FormHelperText id="my-helper-text">Enter your password.</FormHelperText>
                              </FormControl>
                              <div className={classes.button}>
                                   <Button type="submit" onClick={onSubmit}>로그인</Button>
                                   <Button>비밀번호 찾기</Button>
                         </div>
                         </form>
                    </div>
               </Container>
          )
}