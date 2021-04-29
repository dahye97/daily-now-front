import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { useHistory, } from 'react-router';

import {Container, Button,List ,ListItem,ListItemText,ListSubheader,Dialog ,DialogTitle } from '@material-ui/core';
import { makeStyles, createStyles, Theme} from "@material-ui/core/styles";

import Post from './Post/Post';
import DetailPost from './Post/DetailPost';
import NewPost from './NewPost';

import { userInfo } from '../../Interface/User';
import { detailPostInfo,categoryInfo } from '../../Interface/Board';

const useStyles = makeStyles((theme: Theme) => 
     createStyles({
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
     boardBottom : {
          display: "flex",
          justifyContent: "space-evenly"
     },
     myPost: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },
    myPostSection: {
      backgroundColor: 'inherit',
     },
     myPostItem: {
          cursor: 'pointer',
          '&:hover' : {
               background: '#e3f2fd'
          }
     },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
}))

interface BoardProps {
     userObj: userInfo | null,
     typeNum: string, 
     typeName: string
}
export default function Board (props: BoardProps){
     const classes = useStyles()
     const history = useHistory();
     const { typeNum,userObj } = props;
     const [categories, setCategories] = useState<categoryInfo[]>([]) // 카테고리 리스트 
     const [categoryId, setCategoryId] = useState(1) // 현재 카테고리 

     // 새글 작성 함수
     const handleClickWrite = () => {
          if(userObj !== null) {
               history.push({
                    pathname: "/board/write",
                    state: {
                         category_id : categoryId
                    }
               })
          }else {
               alert('로그인이 필요합니다.')
          }
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

     // 선택된 카테고리 id 저장하기 
     const handleCategoryId = (value:number) => {
          setCategoryId(value)
     }

     useEffect(() => {
          getCategories()
     }, [])

     // 내 글 보기 처리 함수
     const [open, setOpen] = useState(false)
     const [myPostList, setMyPostList] = useState<detailPostInfo[]> ([])
     const handleClickMyPost = () => {
          if( userObj !== null ){
               axios.post('http://192.168.0.69:8000/api/notice/my_post', {
                    page_size: 100
               }, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    setMyPostList(res.data.results)
                    setOpen(true)
               })
               .catch(function(error) {
                    console.log(error);
               })
          }else {
               alert('로그인 하셔야 볼 수 있습니다.')
          }
        };
     const handleClose = () => {
         setOpen(false)
     };
     // 선택한 내 글로 이동 
     const handleClickMyPostItem = (e: React.MouseEvent, postId : number) => {
          history.push(`/board/detail/${postId}`, {
                    post_id : postId
          })
     }
     return (
          <Container maxWidth="md" className={classes.boardContainer}>
			<h1>💬 토론해요 </h1>
               <div style={{height: '100%'}}>
                         { typeNum === "01" ? // 게시판
                         <>
                              <Post categories={categories} categoryId={categoryId} handleCategoryId={handleCategoryId}/>
                              <div className={classes.boardBottom}>
                                   <Button onClick={handleClickMyPost} variant="outlined"color="primary">내 글보기</Button>
                                   <Button onClick={handleClickWrite} variant="outlined"color="primary">글쓰기</Button>
                              </div>
                         </>
                         : typeNum === "02" || typeNum === "03" ? // 글쓰기
                          <NewPost userObj={userObj}/>
                         : typeNum === "04" ? // 게시물 
                         <DetailPost userObj={userObj}/>
                         : '로딩중'}

                         {/* 내 글 보기 */}
                              <Dialog fullWidth={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                                   <DialogTitle id="simple-dialog-title"><h2>내가 작성한 글 📝</h2></DialogTitle>
                                   <List className={classes.myPost} subheader={<div />}>

                                   {categories.map((category) => (
                                        <li key={category.category_id} className={classes.myPostSection}>
                                             <ListSubheader><h1>{category.category_name}</h1></ListSubheader>
                                             {myPostList.filter( mypost => 
                                                  mypost.category_id === category.category_id)
                                                  .map( (result,index) => {
                                                       return (
                                                       <ListItem className={classes.myPostItem} onClick={(e: React.MouseEvent) => handleClickMyPostItem(e, result.post_id)} key={index}>
                                                            <ListItemText primary={result.title} />
                                                            <ListItemText style={{textAlign: 'right'}}primary={result.date.split('T')[0].replaceAll('-','. ')} />
                                                       </ListItem>)
                                                  })
                                             }
                                        </li>
                                   ))}
                                   </List>
                              </Dialog>

               </div>
          </Container>
          )
}
