import React from 'react'
import { Button,TextField, Typography} from '@material-ui/core';
import { useHistory } from 'react-router';
import { makeStyles, } from "@material-ui/core/styles";

const useStyles = makeStyles({
     postContent : {
          display:"flex", 
          flexDirection:"column",
          flexFlow: "row wrap"
     }
})
export default function NewPost() {
     const history = useHistory()
     const classes = useStyles()
     const handleSave = () => {
          history.goBack();
     }
     const handleCancel = () => {
          history.goBack();
     }
     return (
          <Typography component="div" style={{height: '100vh',}}>
               <h2>새 글 작성</h2>
               <div className={classes.postContent}>
                    <TextField
                         id="standard-full-width"
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
                    />
                    <TextField
                         id="outlined-multiline-static"
                         label="내용"
                         multiline
                         rows={10}
                         defaultValue="내용을 입력해주세요."
                         variant="outlined"
                         
                    />
                    <div style={{textAlign: "center"}}>
                         <Button onClick={handleSave}>완료</Button>
                         <Button onClick={handleCancel}>취소</Button>
                    </div>
               </div>
          </Typography>
     )
}
