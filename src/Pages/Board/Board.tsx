import React, { useState, useEffect, useCallback} from 'react'
import axios from 'axios';
import { useHistory, useLocation, } from 'react-router';
import queryString from 'query-string'

import {Container, Button,List ,ListItem,ListItemText,ListSubheader,Dialog ,DialogTitle ,useMediaQuery} from '@material-ui/core';
import { makeStyles, createStyles, Theme} from "@material-ui/core/styles";

import Post from 'Pages/Board/Post/Post';
import DetailPost from 'Pages/Board/Post/DetailPost';
import NewPost from 'Pages/Board/NewPost';

import { userInfo } from 'Interface/User';
import { detailPostInfo,categoryInfo } from 'Interface/Board';

import board_holy from 'asset/img/board_holy.png'
import WelcomeLoginAlert from 'Components/Alert/WelcomeLoginAlert';

const useStyles = makeStyles((theme: Theme) => 
     createStyles({
     boardHeader : {
          display: 'flex',
          alignItems: "center",
          paddingLeft: '48px'
     },
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
     boardContainerMobile : {
          width: "100%",
          height: "10%",
          margin: '60px 0',
          padding: 0
     },
     boardBottom : {
          display: "flex",
          flexDirection: 'row',
          justifyContent: "flex-end",
          padding: '0 24px',

          '& > button': {
               borderRadius: '35px',
               margin: '10px',
               padding: '10px'
          }
     },
     boardBottomMobile: {
          display: "flex",
          justifyContent: "space-around",
          flexWrap: 'wrap'
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
export default React.memo(function Board (props: BoardProps){
     const classes = useStyles()
     const history = useHistory();
     const isMobile = useMediaQuery("(max-width: 380px)");

     const { typeNum,userObj } = props;
     const [categories, setCategories] = useState<categoryInfo[]>([]) // 카테고리 리스트 
     const [categoryId, setCategoryId] = useState(1) // 현재 카테고리 

     const location = useLocation()
	const queryObj = queryString.parse(location.search);
	const category = queryObj.category; // url에서 현재 category id 받아오기 
	const pageIndex = queryObj.page; // url에서 현재 page index 받아오기 
     
     const [alertOpen, setAlertOpen] = useState(false)
     const handleAlertClose = () => {
          setAlertOpen(!alertOpen)
      };

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
               handleAlertClose()
          }
     } 

     // 카테고리 목록 불러오기 
     const getCategories = useCallback(
          () => {
               axios.get(`${process.env.REACT_APP_SERVER}/api/notice/category_list`)
               .then(res => {
                    setCategories(res.data)
               })
               .catch(function(error) {
                    console.log(error);
               })  
               },[categoryId],
     )
     // 선택된 카테고리 id 저장하기 
     const handleCategoryId = (value:number) => {
          setCategoryId(value)
     }

     useEffect(() => {
          getCategories()
          // 이전에 선택한 카테고리가 있을 경우 categoryId 값을 업데이트
          if( category ) {
               setCategoryId(Number(category))
          }
     }, [categoryId])

     // 내 글 보기 처리 함수
     const [open, setOpen] = useState(false)
     const [myPostList, setMyPostList] = useState<detailPostInfo[]> ([])
     const handleClickMyPost = () => {
          if( userObj !== null ){
               axios.post(`${process.env.REACT_APP_SERVER}/api/notice/my_post`, {
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
               handleAlertClose()
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
          <Container maxWidth="md" className={isMobile? classes.boardContainerMobile: classes.boardContainer}>
			<div className={classes.boardHeader}>
                    <h2 style={{marginRight: '10px'}}>💬 토론해요 </h2>
                    <div><img src={board_holy} alt="종목토론" width="50px"/></div>
               </div>
               <div style={{height: 'auto'}}>
                         { typeNum === "01" ? // 게시판
                         <>
                              <Post 
                                   categories={categories} 
                                   pageIndex={Number(pageIndex)} 
                                   categoryId={ category ? Number(category) : categoryId} 
                                   handleCategoryId={handleCategoryId}
                              />
                              
                              <div className={classes.boardBottom}>
                                   <Button onClick={handleClickMyPost} variant="contained"color="primary">내 글보기</Button>
                                   <Button onClick={handleClickWrite} variant="contained"color="primary">글쓰기</Button>
                              </div>
                         </>
                         : typeNum === "02" || typeNum === "03" ? // 새 글 쓰기 및 글 수정
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
                         <WelcomeLoginAlert open={alertOpen} />
               </div>
          </Container>
          )
})
