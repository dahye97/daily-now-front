import React,{useState} from 'react'
import axios from 'axios';

import {Paper,Button,Card,Accordion,AccordionDetails  } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from '../../../../Interface/Comment';
import { userInfo } from '../../../../Interface/User';
import CommentForm from './Components/CommentForm';
import CommentView from './Components/CommentView';

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
function Comment(props:CommentProps) {
     const classes = useStyles();
     const {userObj , commentList, postId, handleUpdateComment } = props;

     // 답글 리스트 가져오는 함수
     const [isExpanded, setIsExpanded] = useState('')
     const [recommentList, setRecommentList] = useState<commentInfo[]>([])
     const getReComment = (parent_id: number | null) => {
          setIsExpanded('panel'+parent_id)

          if(userObj!==null) {
               axios.post('http://192.168.0.69:8000/api/notice/comment_list', {
                    post_id: postId,
                    parent_comment: parent_id
               }, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    setRecommentList(res.data)
               })
               .catch(function(error) {
                    console.log(error);
               })   
          }
          }
     // 답글 창 닫기
     const handleCloseRecomment = () => {
          setIsExpanded('panel')
     }

     // 답글 실시간 업데이트 처리 함수 
     const handleUpdateReComment = (parentId: number) => {
          getReComment(parentId)
     }

     // 댓글 수정, 삭제 함수
     const [isEditing, setIsEditing] = useState('')
     const handleEditComment = (commentId? : number) => {
          setIsEditing('panel'+commentId)
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
                             <Accordion 
                             expanded={isExpanded === ('panel'+commentItem.comment_id)} 
                             className={classes.commentItem} key={commentItem.comment_id}>
                              
                              {isEditing === 'panel' + commentItem.comment_id ? 
                              <>
                              {/* 📌 댓글 수정 창 */}
                                   <CommentForm key={commentItem.comment_id}
                                   handleEditComment={handleEditComment} handleUpdateComment={handleUpdateComment} 
                                   commentItem={commentItem} userObj={userObj}/>
                                   <Button onClick={() => setIsEditing('')}>취소</Button>
                              </>
                              : 
                              // 📌 댓글 창
                                   <div style={{display:"flex", justifyContent: "space-between"}}>
                                        <CommentView 
                                        handleUpdateComment={handleUpdateComment}
                                        commentItem={commentItem} handleEditComment={handleEditComment} 
                                        handleDelete={handleDelete} getReComment={getReComment}
                                        userObj={userObj} />
                                   </div>
                                   }

                              {/* 📌 답글 창 */}
                                   <AccordionDetails style={{display:"flex", flexDirection:"column"}}>
                                        <div>
                                             {recommentList.map((recommentItem) => {
                                                  return (
                                                       <div style={{display:"flex", justifyContent: "space-between"}}>
                                                            <CommentView key={recommentItem.comment_id}
                                                            handleUpdateComment={handleUpdateComment}
                                                             recommentItem={recommentItem} handleEditComment={handleEditComment} 
                                                             handleDelete={handleDelete} getReComment={getReComment} userObj={userObj}/>
                                                       </div>
                                                  )
                                             })}
                                        </div>
                                        <CommentForm handleUpdateReComment={handleUpdateReComment} postId={postId} userObj={userObj} parentId={commentItem.comment_id}/>
                                        <Button onClick={handleCloseRecomment}>답글 접기</Button>
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
export default React.memo(Comment)
