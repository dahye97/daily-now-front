import React , {useState,useEffect} from 'react'
import { useHistory, useLocation } from 'react-router';
import axios from 'axios';

import { detailPostInfo } from '../../../../Interface/Post'
import { commentInfo } from '../../../../Interface/Comment';
import { userInfo } from '../../../../Interface/User';
import Comment from '../Comment/Comment';

import { makeStyles } from '@material-ui/core/styles';
import {Paper,IconButton,Typography,
     Table, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core/';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
const useStyles = makeStyles({
     root: {
       width: '100%',
     },
     container: {
       maxHeight: 600,
       background: "#fafafa"
     },
     contentPaper: {
          padding: '30px',
          margin: '10px'
     },
     commentPaper : {
          margin: '10px',
          padding: "10px",
          boxShadow: 'none'
     },
     commentItem: {
          borderBottom: '3px solid #fafafa'
     },
     handButton: {
          textAlign: "center",
          paddingTop: "30px",
     },
     button: {
          color: '#ffb303',
      },
      disabledButton: {
           color: '#cfcfcf'
      }
   });

interface Column {
     id: 'date' | 'title' | 'author' | 'visited' | 'like' | 'unlike';
     label: string | number;
     maxWidth?: number;
     align?: 'left' | 'right';
}

interface stateType {
     post_id : number
}
export default function DetailPost(props: {userObj: userInfo | null,}) {
     const location = useLocation<stateType>()
     const classes = useStyles();
     const history= useHistory();
     const { userObj } = props;

     // 선택한 게시물 행 데이터 만들기 
     const [columns, setColumns] = useState<Column[]>([])
     const createRow = ( start: number, end : number,) => {
          return (<TableRow style={{display:"table-row"}}>
               {columns.slice(start,end).map( column => {
                    return (<TableCell
                         component="th" scope="row"
                         key={column.id}
                         style={{ maxWidth: column.maxWidth , border: "none", padding: "10px", }}
                         align={column.align}
                         >
                         {column.label}
                         </TableCell>)
               })}
          </TableRow>)
     }

     // 선택한 게시물 작성 정보 데이터 불러오기 
     const [detailPost, setDetailPost] = useState<detailPostInfo>(Object)
     const [isLoading, setIsLoading] = useState(true)
     const getDetailData = () => {
          let headerData = {};

          // 로그인 상태 게시물 클릭 시 
          if (userObj !== null ) {
               headerData = {
                    headers: {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               };
          }
          axios.post('http://192.168.0.69:8000/api/notice/detail_post', {
               post_id: location.state.post_id
          }, headerData)
          .then(res => {
               setDetailPost(res.data)
               console.log(res.data)
               setColumns ( [
                    { id: 'title', align:'left',label: res.data.title, maxWidth: 100 },
                    { id: 'visited', align:'right',label: '조회 '+res.data.views, maxWidth: 30 },
                    { id: 'like', align:'right',label: '공감 '+res.data.like, maxWidth: 30 },
                    { id: 'unlike', align:'right',label: '비공감 '+res.data.dislike, maxWidth: 30 },
                    { id: 'author', align:'left',label: res.data.user.slice(0,4) + '****',maxWidth: 30},
                    { id: 'date', align:'right', label: res.data.date, maxWidth:300},
               ]);
               setIsLoading(false)
          })
          .catch(function(error) {
               console.log(error);
          })

     }

     // 댓글 리스트 불러오기 
     const [commentList, setCommentList] = useState<commentInfo[]>([])
     const getCommentList = () => {
          if(userObj!==null){
               axios.post('http://192.168.0.69:8000/api/notice/comment_list', {
                    post_id: location.state.post_id
               },{
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               } )
               .then(res => {
                   setCommentList(res.data)
                   console.log(commentList)
               })
               .catch(function(error) {
                    console.log(error);
               })   
          }
     }

     // 공감 비공감 처리 함수 
     const [isClicked, setIsClicked] = useState(false)
     const [pressableLike, setPressableLike] = useState(true)
     const [pressableDislike, setPressableDislike] = useState(true)
     const handleLikeDisLike = (event: React.MouseEvent) => {
          let queryString; // like, dislike 지정 url
          let label = event.currentTarget.getAttribute('aria-label')
          let likeDislike = -1;
          console.log(event.currentTarget.hasAttribute('disabled'))
          
          if (userObj !== null) {
               console.log('현재 :',detailPost.like_dislike)
               if( detailPost.like_dislike !== -1 ) { // 공감/ 비공감 했을 경우, 취소하기
                    queryString = "cancel_post_like"
                    
                    if( label === "like") {
                         if(detailPost.like_dislike === 1) {
                              likeDislike = 1
                              setPressableLike(false)
                         }else {
                              alert('이미 비공감을 하셨습니다.')
                         }
                    }else if (label === "dislike") {
                         if(detailPost.like_dislike === 0) {
                              likeDislike = 0
                              setPressableDislike(false)
                         }else {
                              alert('이미 공감을 하셨습니다.')
                         }
                    }
               }else { // 공감/비공감 저장하기
                    queryString = "add_post_like"
                    if( label === "like") {
                         likeDislike = 1
                         console.log(event.currentTarget.getAttribute("className"))
                         
                         setPressableLike(true)
                    }else if (label === "dislike") {
                         likeDislike = 0
                         setPressableDislike(true)
                    }
               }
                // add,cancel 결과 
                if( likeDislike !== -1) {
                     axios.post(`http://192.168.0.69:8000/api/notice/${queryString}`, {
                         post_id: location.state.post_id,
                         like_dislike : likeDislike
                    }, {
                         headers : {
                              "Authorization": "Token " + userObj.auth_token,
                         }
                    })
                    .then(res => {
                         console.log(res)
                         setIsClicked(!isClicked)
                    })
                    .catch(function(error) {
                         console.log(error);
                    })
                }
          } else {
               alert('로그인 먼저 해주세요.')
          }
     }
     // 공감, 비공감 실시간 업데이트를 위한 effect  (💭 공감 비공감 view 만 가지고 오는 api 없음)
     useEffect(() => {
          getDetailData()
     }, [isClicked])

     // 댓글 추가 실시간 업데이트 처리 함수
     const handleUpdateComment = () => {
          getCommentList()
     }
 
     useEffect(() => {
          if(detailPost.like_dislike === 1) { 
               setPressableDislike(false)
          }
          else if (detailPost.like_dislike === 0) { 
               setPressableLike(false)
          }
     }, [detailPost])

     useEffect(() => {
          getCommentList()   
     }, [])

     // 게시글 수정, 삭제 함수 
     // todo: 게시글 수정 함수 
     const handleEditPost = () => {
          console.log('post수정')
          history.push(`board/write/${detailPost.post_id}`, {
               // 수정할 게시물 정보
               detailPost: detailPost
          })
          
          // todo 라우터에 board/write/:id 따로 파고, newpost 페이지에 props 값에 따라 텍스트 필드 창 채우게 하기
          // props 값 유무? 혹은 뭐 기준은 내일 만들기.. 기준에 따라 수정 or 완료 post 보낼 수 있게 처리하기 
     }
     const handleDelete = () => {
          console.log('post삭제')
          if(userObj !== null){
               axios.post('http://192.168.0.69:8000/api/notice/delete_post', {
                    post_id:  detailPost.post_id,
                    title: detailPost.title,
                    content: detailPost.content
               }, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    alert('게시물이 삭제되었습니다.')
                    history.goBack()
               })
               .catch(function(error) {
                    console.log(error);
               })
          }

     }
     return (
          <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                         <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                   {isLoading? '로딩중 ' : 
                                   <>
                                        {createRow(0,4)}
                                        {createRow(4,6)}
                                   </>
                                   }
                              </TableHead>
                         </Table>
                    </TableContainer>

                    {/* 글 내용 */}
                    <Paper className={classes.contentPaper}>
                         {detailPost.content}

                         {/* 공감,비공감 버튼 */}
                         <Typography component="div" className={classes.handButton}>
                              <IconButton
                              className={pressableLike ? classes.button : classes.disabledButton}
                              onClick={handleLikeDisLike} aria-label="like"
                              >
                                   <ThumbUpAltIcon />
                              </IconButton>
                              <IconButton 
                              className={pressableDislike ? classes.button : classes.disabledButton}
                              onClick={handleLikeDisLike} aria-label="dislike">
                                   <ThumbDownIcon />
                              </IconButton>
                         </Typography>

                         <Typography component="div" align="right">
                         {/* 수정, 삭제 버튼 */}
                         {detailPost.editable &&
                         <>
                              <IconButton onClick={handleEditPost}><EditIcon /></IconButton>
                              <IconButton onClick={handleDelete}><DeleteForeverIcon /></IconButton>
                         </>
                         }
                         {/* 목록 버튼 */}
                             <IconButton onClick={()=> history.goBack()}><KeyboardBackspaceIcon /></IconButton>
                         </Typography>
                    </Paper>

                    {/* 댓글 창 */}
                    <Comment 
                    userObj={userObj} commentList={commentList} 
                    postId={location.state.post_id} handleUpdateComment={handleUpdateComment}/>
          </Paper>
     )
}