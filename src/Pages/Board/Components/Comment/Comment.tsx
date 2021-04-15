import React,{useState,useEffect} from 'react'
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
     handleIsAddedComment :any
}
export default function Comment(props:CommentProps) {
     const classes = useStyles();
     const {userObj , commentList,postId, handleIsAddedComment} = props;

       // 댓글 작성 함수 
       const [comment, setComment] = useState("")
       const [recomment, setRecomment] = useState("")
       const handleChange = (event: React.ChangeEvent<HTMLInputElement>, parentId?: number) => {
            // parentId 속성이 존재하면 답글, 없으면 댓글  
            if( userObj === null ) {
                 alert('로그인이 필요합니다.')
            }else {
                 if( parentId) {
                    setRecomment(event.target.value)
               }else {
                    setComment(event.target.value)
                 }
            }
       }
     
     // 댓글 저장 함수
     const handleSubmit = (parentId?: number) => {
         
          let canSubmit = false;
          const defaultData = {
               post_id: postId,
               comment_content : comment,
         } // 댓글 일때 보낼 데이터 
         const recommentData = {
              post_id: postId,
              comment_content : recomment,
              parent_comment : parentId
          } // 답글 일때 보낼 데이터 
          let result = defaultData;

         if(parentId) {
               if( recomment.length <= 3) {
                    alert('3자 이상 입력해주세요.');
               }else {
                    canSubmit = true;
                    result = recommentData
               }
         }else { // 댓글
               if( comment.length <= 3) {
                    alert('3자 이상 입력해주세요.');
               }else canSubmit = true;
         }

          if( userObj !== null && canSubmit){
               axios.post('http://192.168.0.69:8000/api/notice/write_comment',
                    result,{
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    if(parentId) {
                         setRecomment("")
                         handleIsAddedReComment(parentId)
                    }else {
                         setComment("")
                         handleIsAddedComment()
                    }
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }

     // 답글 작성 함수
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
           {/* 댓글 창 */}
           <Paper className={classes.commentPaper}>
                         <h3>댓글 {commentList.length}</h3>  
                         {/* 댓글 달기 */}  
                         <CommentForm handleChange={handleChange} handleSubmit={handleSubmit} comment={comment}/>

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
                                                  <CommentForm handleChange={(e: React.ChangeEvent<HTMLInputElement> ) => handleChange(e,commentItem.comment_id)} handleSubmit={() => handleSubmit(commentItem.comment_id)} recomment={recomment} parentId={commentItem.comment_id}/>
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
