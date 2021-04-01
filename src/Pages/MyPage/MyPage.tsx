import React, { Component } from 'react'
import { Container,makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
     userContainer: {
          
     }
});

// TODO: 탈퇴, 회원정보 수정
export default function MyPage() {
     const classes = useStyles()
          return (
               <Container className={classes.userContainer} maxWidth="md">
                    유저 정보 수정 페이지
		     </Container>
          )
}

