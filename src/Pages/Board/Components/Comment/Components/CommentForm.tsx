import React,{useState} from 'react'
import {Typography ,TextField,Button} from '@material-ui/core/';
import { userInfo } from '../../../../../Interface/User';
import axios from 'axios';

interface formProps {
     postId : number
     parentId? : number
     userObj: userInfo | null,
     handleIsAddedComment? : any,
     handleIsAddedReComment? : any,
}
export default function CommentForm(props: formProps) {
     const { parentId,userObj,postId,handleIsAddedComment,handleIsAddedReComment } = props;

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
      // 댓글, 답글 저장 함수
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
