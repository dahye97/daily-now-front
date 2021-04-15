import React from 'react'
import {Typography ,TextField,Button} from '@material-ui/core/';

interface formProps {
     handleChange : any,
     handleSubmit : any,
     comment?: string,
     recomment?: string,
     parentId? : number
}
export default function CommentForm(props: formProps) {
     const { handleChange, handleSubmit, comment, recomment, parentId } = props;
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
