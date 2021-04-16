import React,{useState,useEffect} from 'react'
import {Typography ,TextField,Button} from '@material-ui/core/';
import { userInfo } from '../../../../../Interface/User';
import axios from 'axios';
import { commentInfo } from '../../../../../Interface/Comment';

interface formProps {
     postId? : number // 게시글 id
     parentId? : number // 답글 상위 댓글 id 
     userObj: userInfo | null, 
     handleUpdateComment? : any, // 댓글 업데이트 함수 
     handleEditComment?:(commentId?: number) => void,
     handleIsAddedReComment? : any, // 답글 업데이트 함수 

     commentItem?: commentInfo // 수정 중인 댓글 데이터 
}
export default function CommentForm(props: formProps) {
     const { parentId,userObj,postId,handleUpdateComment,handleIsAddedReComment,handleEditComment, commentItem } = props;
     const [comment, setComment] = useState("")
     const [recomment, setRecomment] = useState("")

     // 댓글, 답글 입력 값 처리 함수 
     const handleChange = (event: React.ChangeEvent<HTMLInputElement>, parent_Id?: number) => {
          // parentId 속성이 존재하면 답글, 없으면 댓글  
          if( userObj === null ) {
               alert('로그인이 필요합니다.')
          }else {
               if( parentId ) {
                  setRecomment(event.target.value)
             }else {
                  setComment(event.target.value)
               }
          }
     }
      // 댓글, 답글 저장 및 수정 함수
      const handleSubmit = (parentId?: number) => {
          let canSubmit = false;
          let url = "write_comment"
          let data;

         if(parentId) { // 답글
               if( recomment.length <= 3) {
                    alert('3자 이상 입력해주세요.');
               }else {
                    data = {
                         post_id: postId,
                         comment_content : recomment,
                         parent_comment : parentId
                    } // 답글 일때 보낼 데이터 
                    canSubmit = true;
               }
         }else { // 댓글
               if(commentItem){
                    url = "update_comment"
                    data = {
                         comment_id: commentItem.comment_id,
                         comment_content: comment
                    } // 수정할 댓글 데이터 
                    canSubmit = true;   
               }else {
                    if( comment.length <= 3) {
                         alert('3자 이상 입력해주세요.');
                    }else {
                         data = {
                              post_id: postId,
                              comment_content : comment,
                         }// 댓글 일때 보낼 데이터 
                         canSubmit = true;   
                    }
               }
         }

          if( userObj !== null && canSubmit){
               axios.post(`http://192.168.0.69:8000/api/notice/${url}`,
                    data,{
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
                         if(commentItem && handleEditComment){
                              handleEditComment()
                         }
                         handleUpdateComment()
                    }
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }

     useEffect(() => {
          if(commentItem) {
               setComment(commentItem.comment_content)
          }
     }, [commentItem])

     return (
          <>
               {/* 댓글 폼 */}
               <Typography component="div">
                              <TextField
                                   value={comment? comment : recomment}
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
                    <Button onClick={() => handleSubmit(parentId)}>등록</Button>
               </Typography>
          </>
     )
}
