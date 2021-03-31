import { makeStyles } from "@material-ui/core/styles";
import { Container,FormControl,InputLabel,Input,FormHelperText,Button } from "@material-ui/core";
import logo from '../asset/img/logo.webp'

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
})
export default function Registration() {
     const classes = useStyles()

          return (
               <Container className={classes.authContainer} maxWidth="sm">
                    <div className={classes.authBox}>
                         <img src={logo} width="80px"/>
                         <h2>Daily Check ✔</h2>
                         <p>매일이 행복한 투자<br/>
                         <b>데일리펀딩이</b> 함께 합니다</p>
                         <FormControl className={classes.input}>
                              {/* 이름 */}
                              <InputLabel htmlFor="input-name">Name</InputLabel>
                              <Input id="input-name"aria-describedby="my-helper-text" type="string"/>
                              <FormHelperText id="my-helper-text">Enter your name.</FormHelperText>
                         </FormControl>
                         <FormControl className={classes.input}>
                              {/* 이메일 */}
                              <InputLabel htmlFor="input-email">Email(ID)</InputLabel>
                              <Input id="input-email"aria-describedby="my-helper-text" type="email"/>
                              <FormHelperText id="my-helper-text">Enter your email.</FormHelperText>
                         </FormControl>
                         <FormControl  className={classes.input}>
                              {/* 비밀번호*/}
                              <InputLabel htmlFor="input-password">Password</InputLabel>
                              <Input id="input-password" aria-describedby="my-helper-text" type="password"/>
                              <FormHelperText id="my-helper-text">Enter your password.</FormHelperText>
                         </FormControl>
                         <div className={classes.button}>
                              <Button>함께하기</Button>
                         </div>
                    </div>
               </Container>
          )
}
