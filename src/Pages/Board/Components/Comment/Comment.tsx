import React,{useState} from 'react'
import axios from 'axios';

import {Paper,IconButton,Typography,Button,Card,Accordion,AccordionDetails  } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from '../../../../Interface/Comment';
import { userInfo } from '../../../../Interface/User';
import CommentForm from './Components/CommentForm';
const useStyles = makeStyles({
     
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
     recommentItem: {
          display: 'none'
     }
   });
interface CommentProps {
     userObj : userInfo | null,
     commentList: Array<commentInfo>,
     postId : number,
     handleIsAddedComment:any
}
export default function Comment(props:CommentProps) {
     const classes = useStyles();
     const {userObj , commentList,postId,handleIsAddedComment } = props;

     // 답글 리스트 가져오는 함수
     const [isExpanded, setIsExpanded] = useState('')
     const [recommentList, setRecommentList] = useState<commentInfo[]>([])
     const getReComment = (parent_id: number) => {
          setIsExpanded('panel'+parent_id)
          console.log(parent_id)

          axios.post('http://192.168.0.69:8000/api/notice/comment_list', {
               post_id: postId,
               parent_comment: parent_id
          })
          .then(res => {
               setRecommentList(res.data)
          })
          .catch(function(error) {
               console.log(error);
          })
          }
     const handleCloseRecomment = () => {
          setIsExpanded('panel')
     }

     // 답글 실시간 업데이트 처리 함수 
     const handleIsAddedReComment = (parentId: number) => {
          getReComment(parentId)
     }

     return (
          <>
           {/* ✅ 댓글 */}
           <Paper className={classes.commentPaper}>
                         <h3>댓글 {commentList.length}</h3>  
                         {/* 댓글 입력 폼 */}  
                         <CommentForm handleIsAddedComment={handleIsAddedComment} postId={postId} userObj={userObj}/>

                         {/* 댓글 리스트  */}
                         {commentList.length === 0 ? 
                         '댓글이 없습니다.' 
                         : 
                              <Card>
                                   <ul style={{padding: '20px', listStyle: 'none'}}>
                                   {commentList.map( commentItem => {
                                   return (
                                        <Accordion expanded={isExpanded === ('panel'+commentItem.comment_id)} className={classes.commentItem} key={commentItem.comment_id}>
                                             <div>
                                        {/* 작성자 */}<li>{commentItem.user.slice(0,4) + "****"}</li>      
                                        {/* 내용 */}<li>{commentItem.comment_content}</li>
                                        {/* 시간 */}<li>{commentItem.date}</li>
                                        {/* 답글 */}<Button onClick={() => getReComment(commentItem.comment_id)}>
                                                       답글</Button>
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
                                             <AccordionDetails style={{display:"flex", flexDirection:"column"}}>
                                                  <div>
                                                       {recommentList.map((recommentItem, index) => {
                                                            return (
                                                                 <Typography key={index}>
                                                                      <div>{recommentItem.user.slice(0,4)+"****"}</div>
                                                                      {recommentItem.comment_content}
                                                                 </Typography>
                                                            )
                                                       })}
                                                  </div>
                                                  <CommentForm handleIsAddedReComment={handleIsAddedReComment} postId={postId} userObj={userObj} parentId={commentItem.comment_id}/>
                                                  <Button onClick={handleCloseRecomment}>답글 닫기</Button>
                                             </AccordionDetails>
                                        </Accordion>
                                        )
                                   })} 
                                   </ul>
                              </Card>       
                         }
                    </Paper>    
          </>
     )
}
