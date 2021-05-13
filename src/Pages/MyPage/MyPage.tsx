import React, { useState,useEffect} from 'react'
import { useHistory } from 'react-router';

import {userInfo} from 'Interface/User'
import { Container,makeStyles,FormControl,InputLabel,Input,FormHelperText,Button,Typography } from "@material-ui/core";

const useStyles = makeStyles({
     userContainer: {
          padding: "100px"
     },
     editPWForm: {
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
     }
});

interface MyPageProps {
     userObj: userInfo | null
     handleWithdrawal: () => void
}
// TODO: 탈퇴, 회원정보 수정
export default function MyPage( props: MyPageProps) {
     const history = useHistory();

     const [password, setPassword] = useState("")
     const [newPassword, setNewPassword] = useState("")

     const [error, setError]= useState(new Map())

     const handleError = (errorId: string, message: string) => {
          if( errorId === "current_password" ) {
               setError((prev) => 
                    new Map([...Array.from(prev), [errorId, "현재 비밀번호가 일치하지 않습니다."]]));
              
          } else {
               setError((prev) => 
                    new Map([...Array.from(prev), [errorId, message]]));
          }
     }
     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (e.target.id === "prevPassword") {
               setPassword(value)
          }else setNewPassword(value)
     }

     const onSubmit = (e: React.MouseEvent) => {
          e.preventDefault();
          let button = e.currentTarget.id;
          
          if (props.userObj !== null) {
               // 회원 탈퇴 
               if (button === "withDrawButton") {
                    fetch(`${process.env.REACT_APP_SERVER}/api/auth/withdrawal`, {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json; charset=utf-8",
                              "Authorization": "Token " + props.userObj.auth_token
                         },
                    }).then(res => {
                         if( res.ok ){               
                              alert("탈퇴가 완료되었습니다.");
                              props.handleWithdrawal()
                              history.push("/")
                              window.sessionStorage.clear();
                         }else alert('탈퇴에 실패했습니다.')
                    })
                    .catch(error =>  console.log(error));

               }else {
               // 비밀번호 변경
                    const passwordInfo = {
                         "current_password": password,
                         "new_password": newPassword
                    }

                    fetch(`${process.env.REACT_APP_SERVER}/api/auth/password_change`, {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json; charset=utf-8",
                              "Authorization": "Token " + props.userObj.auth_token
                         },
                         body: JSON.stringify(passwordInfo),	// json 데이터를 전송
                    })
                         .then(res => {
                              if( res.ok ){               
                                   alert("비밀번호 변경이 완료되었습니다.");
                                   history.push("/")
                              }else {
                                   alert('비밀번호 변경을 실패하였습니다.')
                                   res.json().then( data => {
                                        for ( let [key, value] of Object.entries(data)) {
                                            handleError(`${key}`, `${value}`)
                                        }
                                   })
                              } 
                         })
                         .catch(error =>  console.log(error));
                    }
          }
     }
     const classes = useStyles()

     const inputList = [
          { id: "prevPassword", helperId: "prev-text", type:"password", labelContent: "현 비밀번호", helperText: "current password", errorId: "current_password" },
          { id: "newPassword", helperId: "new-text" , type:"password", labelContent: "새 비밀번호",  helperText: "new password", errorId: "new_password"},
     ]

          return (
               <Container className={classes.userContainer} maxWidth="md">
                    <div> <Typography variant="h5">🔐 회원 정보 수정</Typography> </div>

                    {/* 비밀번호 변경 박스 */}
                    <div className="editBox">
                         <form className={classes.editPWForm}>
                              {inputList.map((item, index) => {
                                   return (
                                        <FormControl 
                                        key={index}
                                        error={ item.errorId && error.has(item.errorId) ? true : undefined } 
                                        >
                                             <InputLabel>{item.labelContent}</InputLabel>
                                             <Input 
                                             id={item.id}
                                             type={item.type} 
                                             onChange={onChange}
                                             />
                                             <FormHelperText>
                                                  { item.errorId && error.has(item.errorId) 
                                                  ? error.get(`${item.errorId}`) : `Enter your ${item.helperText}`}
                                             </FormHelperText>
                                        </FormControl>
                                   )
                              })}
                                   <div>
                                        <Button id="pwButton" type="submit" onClick={onSubmit}>변경하기</Button>
                                   </div>
                         </form>
                    </div>

                    {/* 회원 탈퇴 */}
                    <div>
                         <Button id="withDrawButton" type="submit" onClick={onSubmit}>회원 탈퇴</Button>
                    </div>
		     </Container>
          )
}

