import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
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
     const location = useLocation();
     
     const queryObj = queryString.parse(location.search);
     const { share, ucode }= queryObj;

     const classes = useStyles()
     const history = useHistory();
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

          console.log(registerInfo)
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
               case "ucodeInput":
                    setInvitedCode(value)
                    break
          }
     }

     const inputList = [
          { id: "firstNameInput", helperId: "firstName-text", type:"string", labelContent: "First Name" },
          { id: "lastNameInput", helperId: "firstName-text" , type:"string", labelContent: "Last Name"},
          { id: "userIdInput", helperId: "firstName-text", type:"string", labelContent: "ID *", errorId: "username", },
          { id: "emailInput", helperId: "firstName-text", type:"email", labelContent: "Email(ID) *", errorId: "email",  },
          { id: "passwordInput", helperId: "firstName-text", type:"password", labelContent: "Password *", errorId: "password",  },
          { id: "ucodeInput", helperId: "firstName-text", type:"ucode", labelContent: "Invited Code", errorId: "ucode",  },

     ]

     return (
          <Container className={classes.authContainer} maxWidth="md">
               <div className={classes.authBox}>
                    <img src={logo} width="80px" alt="데일리나우와 함께해요!"/>
                    <h2>Daily Now 💙</h2>
                    <p>매일이 행복한 투자<br/>
                    <b>데일리펀딩이</b> 함께 합니다</p>
                    <form className={classes.registerForm}>

                         {inputList.map((item, index) => {
                              return (
                                   <FormControl 
                                   key={index}
                                   error={ error && item.errorId && error.hasOwnProperty(item.errorId) ? true : undefined } 
                                   className={classes.input}
                                   >
                                        <InputLabel>{item.labelContent}</InputLabel>
                                        <Input 
                                        id={item.id}
                                        type={item.type} 
                                        onChange={onChange}/>
                                        <FormHelperText>
                                             {error && item.errorId && error.hasOwnProperty(item.errorId) 
                                             ? error[`${item.errorId}`] : `Enter your ${item.labelContent}`}
                                        </FormHelperText>
                                   </FormControl>
                              )
                         })}

                         <div className={classes.button}>
                              <Button type="submit" onClick={onSubmit}>함께하기</Button>
                         </div>
                    </form>
               </div>
          </Container>
     )
}
