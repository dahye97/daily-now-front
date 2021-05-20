import React,{useState} from 'react'
import axios from 'axios';

import {Paper,Button,Card,Accordion,AccordionDetails ,useMediaQuery } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from 'Interface/Board';
import { userInfo } from 'Interface/User';
import CommentForm from 'Pages/Board/Comment/Components/CommentForm';
import CommentView from 'Pages/Board/Comment/Components/CommentView';

const useStyles = makeStyles({
     commentPaper : {
          margin: '10px',
          padding: "10px",
          boxShadow: 'none'
     },
     commentPaperMobile : {
          padding: "10px",
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
     const isMobile = useMediaQuery("(max-width: 380px)");
     const {userObj , commentList, postId, handleUpdateComment } = props;

     // 답글 리스트 가져오는 함수
     const [isExpanded, setIsExpanded] = useState('')
     const [recommentList, setRecommentList] = useState<commentInfo[]>([])
     const getReComment = (parent_id: number | null, numberOfRecomment? : number) => {

          setIsExpanded('panel'+parent_id)

          let headerData;
          if (userObj !== null) {
               headerData = {
                         "Authorization": "Token " + userObj.auth_token,
               };
          }

          if( numberOfRecomment !== 0) {
               axios.post(`${process.env.REACT_APP_SERVER}/api/notice/comment_list`, {
                    post_id: postId,
                    parent_comment: parent_id
               },{
                    headers: headerData
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
     const handleDelete = (commentId : number, parentId?: number) => {

          if(userObj !== null){
               axios.post(`${process.env.REACT_APP_SERVER}/api/notice/delete_comment`, {
               comment_id: commentId
          }, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    // 댓글/답글 리스트 업데이트
                    if(parentId) {
                         handleUpdateReComment(parentId)
                    }
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
           <Paper className={isMobile? classes.commentPaperMobile : classes.commentPaper}> 
               <p>댓글 <b style={{color: 'red'}}>{commentList.length 
                                        + commentList.reduce(( sum, cur, i) => {
                                             return sum + cur.num_child
                                        }, 0)}
                         </b>
               </p>  
               {/* 댓글 입력 폼 */}  
               <CommentForm handleUpdateComment={handleUpdateComment} postId={postId} userObj={userObj}/>
               {/* 댓글 리스트  */}
               {commentList.length === 0 ? 
               '댓글이 없습니다.' 
               : 
                    <Card>
                         <ul style={{padding: '0', listStyle: 'none'}}>
                         {commentList.map( commentItem => {
                         return (
                              // 💡 댓글은 선택된 comment만 접히도록 하기 위해 Accordion 태그를 map 함수 안에 두어 commentItem 마다 Accordion을 감싸도록 한다.
                             <Accordion 
                                   expanded={isExpanded === ('panel'+commentItem.comment_id)} 
                                   elevation={0}
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
                                                            handleUpdateComment={handleUpdateComment}
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
                                         handleUpdateComment={handleUpdateComment}
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
