import React,{useState} from 'react'
import axios from 'axios';

import {Paper,IconButton,Typography,Button ,TextField,Card,Accordion,AccordionDetails  } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import { commentInfo } from '../../../../Interface/Comment';
import { userInfo } from '../../../../Interface/User';
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
       const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if( userObj === null ) {
                 alert('로그인이 필요합니다.')
            }else {
                 setComment(event.target.value)
            }
       }
     
     // 댓글 저장 함수
     const handleSubmit = () => {
          if ( comment.length <= 3 ) {
               alert('3자 이상 입력해주세요.');
          } else {
               if( userObj !== null){
                    axios.post('http://192.168.0.69:8000/api/notice/write_comment', {
                         post_id: postId,
                         comment_content : comment
                    }, {
                         headers : {
                              "Authorization": "Token " + userObj.auth_token,
                         }
                    })
                    .then(res => {
                         handleIsAddedComment()
                         setComment('')
                    })
                    .catch(function(error) {
                         console.log(error);
                    })
          }
         }
     }

     // 답글 작성 함수
     const [isExpanded, setIsExpanded] = useState('')
     const [recommentList, setRecommentList] = useState<commentInfo[]>([])
     const handleReComment = (parent_id: number) => {
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
     return (
          <>
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
                                        <Accordion expanded={isExpanded === ('panel'+comment.comment_id)} className={classes.commentItem} key={comment.comment_id}>
                                             <div>
                                   {/* 작성자 */}<li>{comment.user.slice(0,4) + "****"}</li>      
                                   {/* 내용 */}<li>{comment.comment_content}</li>
                                   {/* 시간 */}<li>{comment.date}</li>
                                   {/* 답글 */}<Button onClick={() => handleReComment(comment.comment_id)}>
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
                                             <AccordionDetails>
                                             {recommentList.map((comment) => {
                                                  return (
                                                       <Typography>
                                                            <div>{comment.user.slice(0,4)+"****"}</div>
                                                            {comment.comment_content}
                                                       </Typography>
                                                  )
                                             })}
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
