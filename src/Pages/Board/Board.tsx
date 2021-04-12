import React, { useState, useEffect} from 'react'
import {Container,Typography, Button} from '@material-ui/core';
import { makeStyles, } from "@material-ui/core/styles";
import { useHistory, } from 'react-router';
import axios from 'axios';
import { categoryInfo } from '../../Interface/Category';
import { postInfo } from '../../Interface/Post';
import Post from './Components/Post/Post';

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
     const history = useHistory();
     const [categories, setCategories] = useState<categoryInfo[]>([]) // 카테고리 목록 
     const [categoryId, setCategoryId] = useState(1) // 현재 카테고리 

     const handleClickWrite = () => {
          history.push('/board/write')
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
          <Typography component="div" style={{height: '100vh'}}>
                    <Post categories={categories} categoryId={categoryId} handleCategoryId={handleCategoryId}/>
                    <div className={classes.boardBottom}>
                         <Button variant="outlined"color="primary">내 글보기</Button>
                         <Button onClick={handleClickWrite} variant="outlined"color="primary">글쓰기</Button>
                    </div>
          </Typography>
          )
}
