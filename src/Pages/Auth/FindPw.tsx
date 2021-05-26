import React, {useState} from 'react';
import axios from 'axios';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Stepper,Step, TextField} from '@material-ui/core';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
     return ['이메일로 인증코드 전송', '인증코드 입력', '새 비밀번호 변경'];
   }
   
function getStepContent(stepIndex: number) {
     switch (stepIndex) {
       case 0:
         return '가입하신 사용자의 이메일을 입력해주세요.';
       case 1:
         return '전송된 메일에 포함된 인증코드를 입력해주세요.';
       case 2:
         return '변경하실 새로운 비밀번호를 입력해주세요.';
       default:
         return 'Unknown stepIndex';
     }
   }

export default function FindPw() {
     const classes = useStyles();
     const history = useHistory()
     const [activeStep, setActiveStep] = React.useState(0);
     const steps = getSteps();
     const [isable, setIsable] = useState(false)

     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setIsable(false)
     };

     const handleReset = () => {
          setActiveStep(0);
          history.push('/auth')
     };

     const [email, setEmail] = useState("")
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setEmail(value)
          }

     const handleSendEmail = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/pwd/email_auth_num`, {
               email: email
          })
          .then(res => {
               setIsable(true)
              console.log(res)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     const [code, setCode] = useState("")
     const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setCode(value)
     }

     const [userToken, setUserToken] = useState("")
     const handleSendCode = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/pwd/is_pwd_token`, {
               token: code
          })
          .then(res => {
               setIsable(true)
               setUserToken(res.data)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     const [password, setPassword] = useState("")
     const handleChangePW = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setPassword(value)
     }

     const handleSendPW = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/pwd/password_reset`, {
               new_password: password
          }, {
               headers: {
                    "Authorization": "Token " + userToken,
               }
          })
          .then(res => {
               setIsable(true)
               alert('변경완료')
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     return (
          <div className={classes.root}>
               <Stepper activeStep={activeStep} alternativeLabel>
               {steps.map((label) => (
               <Step key={label}>
                    <StepLabel>{label}</StepLabel>
               </Step>
               ))}
               </Stepper>
               <div>
                    {activeStep === steps.length ? (
                         <div>
                              <Typography className={classes.instructions}>변경이 완료되었습니다. 다시 로그인 해주세요.</Typography>
                              <Button onClick={handleReset}>Reset</Button>
                         </div>
                    ) : (
                         <div>
                              <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                         {activeStep === 0 
                         ? <div>
                               {/* 이메일 입력 창 */}
                                   <TextField
                                        id="filled-email-input"
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        value={email}
                                        onChange={handleChange}
                                   />
                                   <Button variant="contained" color="primary" onClick={handleSendEmail}>전송하기</Button>
                              </div>
                              : activeStep === 1 ?
                              <div>
                              {/* 인증코드 입력 창 */}
                                   <TextField
                                        id="filled-code-input"
                                        label="Code"
                                        type="string"
                                        variant="outlined"
                                        value={code}
                                        onChange={handleChangeCode}
                                   />
                                   <Button variant="contained" color="primary" onClick={handleSendCode}>인증하기</Button>

                              </div>
                              : activeStep === 2 ?
                              <div>
                              {/* 새로운 비밀번호 입력 창 */}
                                   <TextField
                                        id="filled-password-input"
                                        label="New Password"
                                        type="password"
                                        variant="outlined"
                                        value={password}
                                        onChange={handleChangePW}
                                   />
                                   <Button variant="contained" color="primary" onClick={handleSendPW}>변경하기</Button>

                              </div>
                              : null
                         }
                         <Button disabled={!isable} variant="contained" color="primary" onClick={handleNext}>
                                   {activeStep === steps.length - 1 ? 'Finish' : '다음으로'}
                              </Button>
                         </div>
                    )}
               </div>
        </div>
     )
}
