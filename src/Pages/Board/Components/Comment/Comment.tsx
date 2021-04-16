import React,{useState} from 'react'
import axios from 'axios';

import {Paper,IconButton,Typography,Button,Card,Accordion,AccordionDetails  } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from '../../../../Interface/Comment';
import { userInfo } from '../../../../Interface/User';
import CommentForm from './Components/CommentForm';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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
     handleUpdateComment:any
}
export default function Comment(props:CommentProps) {
     const classes = useStyles();
     const {userObj , commentList, postId, handleUpdateComment } = props;

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
     // 답글 창 닫기
     const handleCloseRecomment = () => {
          setIsExpanded('panel')
     }

     // 답글 실시간 업데이트 처리 함수 
     const handleIsAddedReComment = (parentId: number) => {
          getReComment(parentId)
     }

     // 댓글 수정, 삭제 함수
     // todo: 댓글 수정 함수
     const [isEditing, setIsEditing] = useState(false)
     const handleEditComment = () => {
          setIsEditing(!isEditing)
          // if(userObj !== null){
          //      axios.post('http://192.168.0.69:8000/api/notice/update_comment', {
          //      comment_id: commentId,
          //      comment_content: "수정된 댓글"
          // }, {
          //           headers : {
          //                "Authorization": "Token " + userObj.auth_token,
          //           }
          //      })
          //      .then(res => {
          //           handleUpdateComment()
          //      })
          //      .catch(function(error) {
          //           console.log(error);
          //      })
          // }
     }
     const handleDelete = (commentId : number) => {

          if(userObj !== null){
               axios.post('http://192.168.0.69:8000/api/notice/delete_comment', {
               comment_id: commentId
          }, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    alert('댓글이 삭제되었습니다.')
                    handleUpdateComment()
               })
               .catch(function(error) {
                    console.log(error);
               })
          }


     }
     return (
          <>
           {/* ✅ 댓글 */}
           <Paper className={classes.commentPaper}>
               <h3>댓글 {commentList.length}</h3>  
               {/* 댓글 입력 폼 */}  
               <CommentForm handleUpdateComment={handleUpdateComment} postId={postId} userObj={userObj}/>

               {/* 댓글 리스트  */}
               {commentList.length === 0 ? 
               '댓글이 없습니다.' 
               : 
                    <Card>
                         <ul style={{padding: '20px', listStyle: 'none'}}>
                         {commentList.map( commentItem => {
                         return (
                              // 댓글 창
                              <>
                              {isEditing ? 
                              <>
                              {/* 댓글 수정 창 */}
                                   <CommentForm handleEditComment={handleEditComment} handleUpdateComment={handleUpdateComment} commentItem={commentItem} userObj={userObj}/>
                                   <Button onClick={() => setIsEditing(false)}>취소</Button>
                              </>
                              : <Accordion expanded={isExpanded === ('panel'+commentItem.comment_id)} className={classes.commentItem} key={commentItem.comment_id}>
                                   <div style={{display:"flex", justifyContent: "space-between"}}>
                                        <div>
                                   {/* 작성자 */}<li>{commentItem.user.slice(0,4) + "****"}</li>      
                                   {/* 내용 */}<li>{commentItem.comment_content}</li>
                                   {/* 시간 */}<li>{commentItem.date}</li>
                                   {/* 답글 */}<Button onClick={() => getReComment(commentItem.comment_id)}>답글</Button>
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
                                        { commentItem.editable &&
                                             <div>
                                                  <IconButton onClick={handleEditComment}><EditIcon /></IconButton>
                                                  <IconButton onClick={() => handleDelete(commentItem.comment_id)}><DeleteForeverIcon /></IconButton>
                                             </div>  
                                        }
                                        
                                   </div>
                                   {/* 답글 창 */}
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
                              }
                              </>
                              )
                         })} 
                         </ul>
                    </Card>       
               }
           </Paper>    
          </>
     )
}
