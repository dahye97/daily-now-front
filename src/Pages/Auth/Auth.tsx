import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
import logo from '../../asset/img/logo.webp'
import { useHistory } from 'react-router';
import useCookies from 'react-cookies'
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

export default function Auth (Props:any) {
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
          
          // const [token, setToken, removeToken] = useCookies(["loginToken"]);

          fetch('http://192.168.0.69:8000/api/auth/login', {
               method: "POST",
               headers: {
                    "Content-Type": "application/json; charset=utf-8",
               },
               body: JSON.stringify(loginInfo),	// json 데이터를 전송
          })
               .then(res => {
                    console.log(res)
                    if( res.ok ){
                         history.push("/")
                         
                         alert("로그인 완료");
                    }else alert('로그인 실패')
               })
               .catch(error =>  console.log(error));
               
          }
     return (
               <Container className={classes.authContainer} maxWidth="sm">
                    <div className={classes.authBox}>
                         <img src={logo} width="80px"/>
                         <h2>Daily Check ✔</h2>
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