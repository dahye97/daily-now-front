import React, {  } from 'react'
import {Container,Typography, Button} from '@material-ui/core';
import { makeStyles, } from "@material-ui/core/styles";
import BoardBar from './Components/NavBar/BoardBar';
import PostList from './Components/Post/Post';

// TODO: 커뮤니티 게시판
const useStyles = makeStyles({
     boardContainer : {
          padding: "20px",
		marginTop: "80px",
          marginBottom: "80px",
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "0 5px 15px #b1b1b1, 0 5px 15px #ffffff",
		minWidth : "580px",
		overflow: "hidden",
     },
     boardHeader: {
          
     },
     boardBottom : {
          display: "flex",
          justifyContent: "space-evenly"
     }
})
export default function Board () {
     const classes = useStyles()
          return (
               <Container maxWidth="md" className={classes.boardContainer}>
                    <Typography><h1>💫 Community </h1></Typography>
                   
                    <Typography component="div" style={{height: '100vh'}}>
                         <BoardBar />
                         <PostList />
                         <div className={classes.boardBottom}>
                              <Button variant="outlined"color="primary">내 글보기</Button>
                              <Button variant="outlined"color="primary">글쓰기</Button>
                         </div>
                    </Typography>


                    
               </Container>
          )
}
