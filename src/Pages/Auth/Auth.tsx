import { useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button, useMediaQuery } from "@material-ui/core";
import logo from 'asset/img/logo.webp'
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import { userInfo } from 'Interface/User';
import FindPw from './FindPw';

// TODO: 로그인 페이지 

const useStyles = makeStyles({
     authContainer: {
          padding: "100px",
          width: "100%",
          minWidth: "400px",
          height: '100vh'
     },
     authContainerMobile : {
          width: "100%",
          height: "10%",
          padding: 0,
          margin: 0,
          paddingTop: "100px",
     },
	authBox: {
		padding: "50px 0",
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "13px 13px 34px #b1b1b1, -13px -13px 34px #ffffff",
		overflow: "hidden",
          textAlign: "center",
          minWidth: "400px",
          height:'100%',
          minHeight: '740px',
          display:'flex',
          flexDirection:'column',
          alignItems: "center"
     },
     authBoxMobile: {
          width: "100%",
          height: "10%",
          padding:0,
          paddingTop:'100px',
          textAlign: "center",
     },
     loginForm : {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin:'30px 0'
     },
     input: {
          margin: "8px",
          width: '350px'
     },
     button : {
          marginTop: "20px",
          '& button': {
               margin:'10px'
          }
     }
});

interface AuthProps {
     handleLogIn : ( data: userInfo ) => void
     typeNum: string, 
     typeName: string
}
export default function Auth (Props:AuthProps) {
     const classes = useStyles()
     const isMobile = useMediaQuery("(max-width: 380px)");
     const history = useHistory();

     const {handleLogIn,typeNum} = Props;
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [error, setError] = useState(Object)

     const emailInput = useRef<HTMLInputElement>()
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (e.target.id === "email") {
               setEmail(value)
          }else setPassword(value)
     }
     
     const [isLoggedIn, setIsLoggedIn] = useState('')
     const handleSubmit = (e: React.MouseEvent) => {
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
                                   handleLogIn(data)
                                   setIsLoggedIn("true")

                                   window.sessionStorage.setItem('email', email);
                                   window.sessionStorage.setItem('id', data.id);
                                   window.sessionStorage.setItem('username', data.username);
                                   window.sessionStorage.setItem('auth_token', data.auth_token);

                                   history.push("/")
                              
                         }else {
                              setError(data)
                              for( let elem in data ){
                                   document.getElementById(elem)?.setAttribute('error', "")
                              }
                              setPassword('')     
                              setEmail('')

                              if( emailInput.current ) {
                                   emailInput.current.focus()
                              }
                              setIsLoggedIn("false")   
                         }
                    })
               })
               .catch(error =>  console.log(error));
               
          }

     const handleFindPw = () => {
          history.push('/auth/find_pw')
     }
     return (
               <Container className={ isMobile? classes.authContainerMobile : classes.authContainer}>
                    <Container className={isMobile? classes.authBoxMobile : classes.authBox}>
                         <img src={logo} width="100px" alt="데일리나우와 함께해요!"/>
                         <h2>Daily Now 💙</h2>
                         <p>매일이 행복한 투자<br/>
                         <b>데일리나우가</b> 함께 합니다</p>

                         { typeNum === "01" 
                         ? // 로그인폼
                              <form className={classes.loginForm}>
                              {isLoggedIn === "true" ? (<Alert severity="success">로그인 되었습니다</Alert>) 
                                        : (isLoggedIn === "false") ? (<Alert severity="error">로그인에 실패하였습니다. 다시 시도해주세요.</Alert>)
                                        : null}
                                   <FormControl className={classes.input} error={ error && error.hasOwnProperty("email") ? true : undefined } >
                                        {/* 이메일 */}
                                        <InputLabel htmlFor="email">Email(ID)</InputLabel>
                                        <Input autoFocus inputRef={emailInput} onChange={handleChange} value={email} id="email"aria-describedby="my-helper-text" type="email"/>
                                        <FormHelperText id="my-helper-text">
                                        {error && error.hasOwnProperty("email") ? "이메일(ID)을 입력해주세요.": "Enter your email."}
                                        </FormHelperText>
                                        
                                   </FormControl>
                                   <FormControl  className={classes.input} error={ error && error.hasOwnProperty("password") ? true : undefined }>
                                        {/* 비밀번호*/}
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <Input onChange={handleChange}  value={password} id="password" aria-describedby="my-helper-text" type="password"/>
                                        <FormHelperText id="my-helper-text">
                                        {error && error.hasOwnProperty("password") ? "비밀번호를 입력해주세요.": "Enter your password."}
                                        </FormHelperText>
                                   </FormControl>
                                   <div className={classes.button}>
                                        <Button variant="contained"  color="primary" type="submit" onClick={handleSubmit}>로그인</Button>
                                        <Button variant="contained" color="primary" onClick={handleFindPw}>비밀번호 재발급</Button>
                                   </div>
                              </form>
                         : /* 비밀번호 재발급 */
                              <FindPw />
                         }
                    </Container>
               </Container>
          )
}