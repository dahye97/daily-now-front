import React , {useState,useEffect} from 'react'
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import { detailPostInfo } from '../../../../../Interface/Post'
import {Paper,IconButton,Typography,Button ,TextField,Card} from '@material-ui/core/';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { useHistory, useLocation } from 'react-router';
import { commentInfo } from '../../../../../Interface/Comment';
import { userInfo } from '../../../../../Interface/User';
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
          axios.post('http://192.168.0.69:8000/api/notice/detail_post', {
               post_id: location.state.post_id
          })
          .then(res => {
               setDetailPost(res.data)
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
          axios.post('http://192.168.0.69:8000/api/notice/comment_list', {
               post_id: location.state.post_id
          })
          .then(res => {
              setCommentList(res.data)
              console.log(commentList)
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     // 댓글 작성 및 등록하기 
     const [comment, setComment] = useState("")
     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setComment(event.target.value)
     }
     const handleSubmit = () => {
          if ( comment.length <= 3 ) {
               alert('3자 이상 입력해주세요.');
          } else {
               if( userObj !== null){
                    axios.post('http://192.168.0.69:8000/api/notice/write_comment', {
                         post_id: location.state.post_id,
                         comment_content : comment
                    }, {
                         headers : {
                              "Authorization": "Token " + userObj.auth_token,
                         }
                    })
                    .then(res => {
                     //    setCommentList(res.data)
                        console.log(res)
                    })
                    .catch(function(error) {
                         console.log(error);
                    })
          }
         }
     }
     useEffect(() => {
          getDetailData()
          getCommentList()
     }, [])
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
                              <IconButton aria-label="like">
                                   <ThumbUpAltIcon />
                              </IconButton>
                              <IconButton aria-label="dislike">
                                   <ThumbDownIcon />
                              </IconButton>
                         </Typography>
                         
                         {/* 목록 버튼 */}
                         <Typography component="div" align="right">
                             <Button onClick={()=> history.goBack()}>목록</Button>
                         </Typography>
                    </Paper>

                    {/* 댓글 창 */}
                    <Paper className={classes.commentPaper}>
                         <h3>댓글 {commentList.length}</h3>  
                         {/* 댓글 달기 */}  
                         <Typography component="div">
                              <TextField
                                   value={comment}
                                   id="contentField"
                                   label="내용"
                                   multiline
                                   rows={3}
                                   defaultValue="주제와 무관한 댓글, 악플은 삭제될 수 있습니다."
                                   variant="outlined"
                                   fullWidth
                                   onChange={handleChange}
                              />          
                         </Typography>  
                         <Typography component="div" align="right">
                             <Button onClick={handleSubmit}>등록</Button>
                         </Typography>

                         {/* 댓글 리스트  */}
                         {commentList.length === 0 ? 
                         '댓글이 없습니다.' 
                         : 
                              <Card>
                                   <ul style={{padding: '20px', listStyle: 'none'}}>
                                   {commentList.map( comment => {
                                   return (
                                        <div className={classes.commentItem} key={comment.comment_id}>
                              {/* 작성자 */}<li>{comment.user.slice(0,4) + "****"}</li>      
                              {/* 내용 */}<li>{comment.comment_content}</li>
                              {/* 시간 */}<li>{comment.date}</li>
                              {/* 답글 */}<Button>답글</Button>
                              {/* 공감, 비공감 */}
                                             <Typography component="span" className={classes.handButton}>
                                                  <IconButton aria-label="like">
                                                       <ThumbUpAltIcon />
                                                  </IconButton>
                                                  <IconButton aria-label="dislike">
                                                       <ThumbDownIcon />
                                                  </IconButton>
                                             </Typography>
                                        </div>
                                        )
                                   })} 
                                   </ul>
                              </Card>       
                         }
                    </Paper>
          </Paper>
     )
}