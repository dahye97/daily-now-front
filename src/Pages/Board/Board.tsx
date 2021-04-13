import React, { useState, useEffect} from 'react'
import {Container,Typography, Button} from '@material-ui/core';
import { makeStyles, } from "@material-ui/core/styles";
import { useHistory, } from 'react-router';
import axios from 'axios';
import { categoryInfo } from '../../Interface/Category';
import Post from './Components/Post/Post';
import NewPost from './NewPost';
import { userInfo } from '../../Interface/User';
import DetailPost from './Components/Post/Components/DetailPost';

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

interface BoardProps {
     userObj: userInfo | null,
     typeNum: string, 
     typeName: string
}
export default function Board (props: BoardProps){
     const classes = useStyles()
     const history = useHistory();
     const { typeNum,userObj } = props;
     const [categories, setCategories] = useState<categoryInfo[]>([]) // 카테고리 목록 
     const [categoryId, setCategoryId] = useState(1) // 현재 카테고리 

     const handleClickWrite = () => {
          history.push({
               pathname: "/board/write",
               state: {
                    category_id : categoryId
               }
          })
     } 
     // 카테고리 목록 불러오기 
     const getCategories = ()=> {
          axios.get('http://192.168.0.69:8000/api/notice/category_list')
               .then(res => {
                    setCategories(res.data)
               })
               .catch(function(error) {
                    console.log(error);
                })  
     }

     const handleCategoryId = (value:number) => {
          setCategoryId(value)
     }

     useEffect(() => {
          getCategories()
     }, [])
     return (
          <Container maxWidth="md" className={classes.boardContainer}>
			<Typography><h1>💫 Community </h1></Typography>
               <Typography component="div" style={{height: '100%'}}>
                         { typeNum === "01" ? 
                         <>
                              <Post categories={categories} categoryId={categoryId} handleCategoryId={handleCategoryId}/>
                              <div className={classes.boardBottom}>
                                   <Button variant="outlined"color="primary">내 글보기</Button>
                                   <Button onClick={handleClickWrite} variant="outlined"color="primary">글쓰기</Button>
                              </div>
                         </>
                         : typeNum === "02" ?
                          <NewPost userObj={userObj}/>
                         : typeNum === "03" ?
                         <DetailPost userObj={userObj}/>
                         : '로딩중'}


               </Typography>
          </Container>
          )
}
