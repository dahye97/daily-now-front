import React, { useState } from 'react'
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
                              alert("탈퇴 완료");
                              props.handleWithdrawal()
                              history.push("/")
                         }else alert('탈퇴 실패')
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
                                   alert("변경 완료");
                                   history.push("/")
                              }else alert('변경 실패')
                         })
                         .catch(error =>  console.log(error));
                    }
          }
     }
     const classes = useStyles()
          return (
               <Container className={classes.userContainer} maxWidth="md">
                    <div> <Typography variant="h5">🔐 회원 정보 수정</Typography> </div>

                    {/* 비밀번호 변경 박스 */}
                    <div className="editBox">
                         <form className={classes.editPWForm}>
                                   <FormControl >
                                        <InputLabel htmlFor="prevPassword">이전 비밀번호</InputLabel>
                                        <Input onChange={onChange}  id="prevPassword" aria-describedby="my-helper-text" type="password"/>
                                        <FormHelperText id="my-helper-text">Enter your current password.</FormHelperText>
                                   </FormControl>
                              
                                   <FormControl >
                                        <InputLabel htmlFor="newPassword">새 비밀번호</InputLabel>
                                        <Input onChange={onChange}  id="newPassword" aria-describedby="my-helper-text" type="password"/>
                                        <FormHelperText id="my-helper-text">Enter your new password.</FormHelperText>
                                   </FormControl>
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

