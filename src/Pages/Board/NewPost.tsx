import React,{useState,useEffect} from 'react'
import axios from 'axios';

import { Button,TextField, Typography} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, } from "@material-ui/core/styles";
import { userInfo } from '../../Interface/User';
import { detailPostInfo } from '../../Interface/Post';

const useStyles = makeStyles({
     postContent : {
          display:"flex", 
          flexDirection:"column",
          flexFlow: "row wrap"
     }
})
interface newPostProps {
     userObj : userInfo | null,
     
}
interface stateType {
     category_id : number,
     detailPost : detailPostInfo // 수정 시 받아올 게시글 데이터
}

export default function NewPost(props: newPostProps) {
     const location = useLocation<stateType>();
     const history = useHistory()
     const classes = useStyles()

     const { userObj } = props
     const { category_id, detailPost } = location.state
     const [title, setTitle] = useState('')
     const [content, setContent] = useState('')
     
     // 글 등록 및 수정 
     const handleSave = () => {
          let url;
          let data;
          if(detailPost) { // 글 수정 시 \
               url = "update_post" 
               data = {
                    "title" : title,
                    "content" : content,
                    "post_id" : detailPost.post_id,
               }
          }else { // 글 등록 시
               url = "write_post" 
               data = {
                    "title" : title,
                    "content" : content,
                    "category_id" : category_id
               }
          }
          if (userObj !== null ){
               axios.post(`http://192.168.0.69:8000/api/notice/${url}`, 
                    data, {
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               })
               .then(res => {
                    console.log(res)
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
          history.goBack();
     }
     // 글 작성 취소
     const handleCancel = () => {
          history.goBack();
     }
     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const id = event.target.id;
          
          if( id === "titleField") {
               setTitle(event.target.value)
          } else if ( id === "contentField"){
               setContent(event.target.value)
          }
     }

     useEffect(() => {
          if(detailPost) {
               setTitle(detailPost.title)
               setContent(detailPost.content)     
          }
     }, [detailPost])

     return (
          <Typography component="div" style={{height: '100vh',}}>
               <h2>새 글 {detailPost ? "수정" : "작성"}</h2>
               <div className={classes.postContent}>
                    <TextField
                         value={title}
                         id="titleField"
                         label="제목"
                         autoFocus
                         style={{ margin: 10}}
                         fullWidth
                         rowsMax={50}
                         required
                         margin="normal"
                         InputLabelProps={{
                         shrink: true,
                         }}
                         onChange={handleChange}
                    />
                    <TextField
                         value={content}
                         id="contentField"
                         label="내용"
                         multiline
                         rows={10}
                         defaultValue="내용을 입력해주세요."
                         variant="outlined"
                         onChange={handleChange}
                    />
                    <div style={{textAlign: "center"}}>
                         <Button onClick={handleSave}>완료</Button>
                         <Button onClick={handleCancel}>취소</Button>
                    </div>
               </div>
          </Typography>
     )
}
