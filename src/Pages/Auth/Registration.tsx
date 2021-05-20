import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button,useMediaQuery } from "@material-ui/core";
import logo from 'asset/img/logo.webp'
import React, {useState,useEffect} from "react";
import { useCookies} from 'react-cookie';
import { useHistory, useLocation } from "react-router";
import queryString from 'query-string'

// 회원가입 페이지
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
          minWidth: "350px"
	},
     authContainerMobile : {
          width: "90%",
          height: "10%",
          paddingTop: "100px",
     },
     authBoxMobile: {
          padding: "20px",
          textAlign: "center",
     },
     registerForm : {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
     },
     input: {
          margin: "8px",
          width: '350px'
     },
     button : {
          marginTop: "20px"
     }
})

export default function Registration() {
     const location = useLocation();
     
     const queryObj = queryString.parse(location.search);
     const { share, ucode }= queryObj;

     const classes = useStyles()
     const history = useHistory();
     const isMobile = useMediaQuery("(max-width: 380px)");

     const [cookies, setCookie, removeCookie] = useCookies([]);

     const [firstName, setFirstName] = useState("")
     const [lastName, setLastName] = useState("")
     const [id, setId] = useState("")
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     
     const [invitedCode, setInvitedCode] = useState<string | string[] | null>('')
     const [error, setError] = useState(Object)

     useEffect(() => {
          if(share) {
               setInvitedCode(ucode)
          }
     }, [share])
     
     const onSubmit = (e: React.MouseEvent) => {
          e.preventDefault();
          let registerInfo = {
               "username": id,
               "email": email,
               "password": password,
               "first_name": firstName,
               "last_name": lastName,
               "code" : invitedCode
          };

          // console.log(registerInfo)
          fetch(`${process.env.REACT_APP_SERVER}/api/auth/register`, {
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
                         alert('회원가입을 실패하였습니다.')
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
               case "ucodeInput":
                    setInvitedCode(value)
                    break
          }
     }

     const handleVerifyEmail = () => {
          console.log('이메일 인증 코드 받기')
     }
     const inputList = [
          { id: "firstNameInput", type:"string", labelContent: "이름", description: "first name"},
          { id: "lastNameInput" , type:"string", labelContent: "성",  description: "last name"},
          { id: "userIdInput", type:"string", labelContent: "별명 *",  description: "id", errorId: "username", },
          { id: "emailInput", type:"email", labelContent: "이메일 *",  description: "email", errorId: "email"},
          { id: "passwordInput", type:"password", labelContent: "비밀번호 *",  description: "password", errorId: "password",  },
          { id: "ucodeInput", type:"ucode", labelContent: "초대 코드",  description: "invited code", errorId: "ucode",  },

     ]

     return (
          <Container className={isMobile? classes.authContainerMobile : classes.authContainer} maxWidth="md">
               <Container className={isMobile? classes.authBoxMobile : classes.authBox}>
                    <img src={logo} width="80px" alt="데일리나우와 함께해요!"/>
                    <h2>Daily Now 💙</h2>
                    <p>매일이 행복한 투자<br/>
                    <b>데일리나우가</b> 함께 합니다</p>
                    <form className={classes.registerForm}>
                         {inputList.map((item, index) => {
                              return (
                                   <div style={{display:'flex', flexDirection:'row'}}>
                                        <FormControl 
                                        key={index}
                                        error={ error && item.errorId && error.hasOwnProperty(item.errorId) ? true : undefined } 
                                        className={classes.input}
                                        // {...(item.id === "emailInput") ? {style: {width: '250px'}} : {}}
                                        >
                                             <InputLabel>{item.labelContent}</InputLabel>
                                             <Input 
                                             id={item.id}
                                             type={item.type} 
                                             onChange={onChange}
                                             {...(item.id === "ucodeInput") && ucode ? {value: ucode} : {}}
                                             />
                                             <FormHelperText>
                                                  {error && item.errorId && error.hasOwnProperty(item.errorId) 
                                                  ? (item.errorId === "ucode" ? "유효한 초대코드가 아닙니다." : error[`${item.errorId}`])
                                                  : `Enter your ${item.description}`}
                                             </FormHelperText>
                                        </FormControl>
{/* 
                                        { item.id === "emailInput" && <Button color="primary" style={{minWidth: '100px', padding: 0}} onClick={handleVerifyEmail} >인증코드 받기</Button> }
                                                  */}
                                   </div>
                              )
                         })}

                         <div className={classes.button}>
                              <Button type="submit" onClick={onSubmit}>함께하기</Button>
                         </div>
                    </form>
               </Container>
          </Container>
     )
}
