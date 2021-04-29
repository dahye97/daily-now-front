import React,{useState} from 'react'
import axios from 'axios';

import {Paper,Button,Card,Accordion,AccordionDetails  } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from '../../../Interface/Board';
import { userInfo } from '../../../Interface/User';
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
     recommentContainer: {
          display:"flex",
          flexDirection:"column",
          background: '#FBFCFD'
     },
     recommentItem: {
          display: 'none',
     },

   });
interface CommentProps {
     userObj : userInfo | null,
     commentList: Array<commentInfo>,
     postId : number,
     handleUpdateComment:() => void
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
     const handleEdit = (commentId? : number) => {
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
               <p>댓글 <b style={{color: 'red'}}>{commentList.length + recommentList.length}</b></p>  
               {/* 댓글 입력 폼 */}  
               <CommentForm handleUpdateComment={handleUpdateComment} postId={postId} userObj={userObj}/>
               {/* 댓글 리스트  */}
               {commentList.length === 0 ? 
               '댓글이 없습니다.' 
               : 
                    <Card>
                         {/* <span style={{display: 'inline-block', background: 'green'}}>
                              <img src="https://guest.goodchoice.kr/img/asset/icn_1_info_64x64.png" />
                         </span> */}
                         <ul style={{padding: '20px', listStyle: 'none'}}>
                         {commentList.map( commentItem => {
                         return (
                              // 💡 댓글은 선택된 comment만 접히도록 하기 위해 Accordion 태그를 map 함수 안에 두어 commentItem 마다 Accordion을 감싸도록 한다.
                             <Accordion 
                                   expanded={isExpanded === ('panel'+commentItem.comment_id)} 
                                   className={classes.commentItem} 
                                   key={commentItem.comment_id}
                             >
                              {isEditing === 'panel' + commentItem.comment_id ? 
                              <>
                              {/* 📌 댓글 수정 창 */}
                                   <CommentForm 
                                   handleEdit={handleEdit} 
                                   handleUpdateComment={handleUpdateComment} 
                                   commentItem={commentItem} 
                                   userObj={userObj}/>
                                   <Button onClick={() => setIsEditing('')}>취소</Button>
                              </>
                              : 
                              // 📌 댓글 창
                                        <CommentView 
                                        handleEdit={handleEdit} 
                                        handleUpdateComment={handleUpdateComment}
                                        commentItem={commentItem} 
                                        handleDelete={handleDelete} getReComment={getReComment}
                                        userObj={userObj} />
                                   }

                                   <AccordionDetails className={classes.recommentContainer}>
                                        <div>
                                             {recommentList.map((recommentItem) => {                                                  
                                                  return (
                                                       isEditing === 'panel' + recommentItem.comment_id ?    
                                                       <>
                                                       {/* 📌 답글 수정 창 */}
                                                            <CommentForm 
                                                            key={recommentItem.comment_id}
                                                            handleEdit={handleEdit} 
                                                            handleUpdateReComment={handleUpdateReComment} 
                                                            recommentItem={recommentItem} 
                                                            userObj={userObj} 
                                                            parentId={ recommentItem.parent_comment}/>
                                                             
                                                            <Button onClick={() => setIsEditing('')}>취소</Button>
                                                       </>

                                                       : 
                                                       // 📌 답글 창
                                                            <CommentView
                                                            key={recommentItem.comment_id}
                                                            handleEdit={handleEdit} 
                                                            handleUpdateComment={handleUpdateComment}
                                                            recommentItem={recommentItem} 
                                                            handleDelete={handleDelete} getReComment={getReComment}
                                                            userObj={userObj}/>
                                                       
                                                  )
                                             })}
                                        </div>
                                        <CommentForm 
                                        handleUpdateReComment={handleUpdateReComment}
                                        postId={postId} 
                                        userObj={userObj} 
                                        parentId={commentItem.comment_id}/>
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
