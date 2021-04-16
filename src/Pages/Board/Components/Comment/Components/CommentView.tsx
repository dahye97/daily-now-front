import React,{useState,useEffect} from 'react'
import { commentInfo } from '../../../../../Interface/Comment'
import {IconButton,Typography,Button} from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles({
     handButton: {
          textAlign: "center",
          paddingTop: "30px",
     },
})
interface viewProps {
     commentItem?: commentInfo
     recommentItem?: commentInfo,
     handleEditComment: any,
     handleDelete : any,
     getReComment: (parentId: number) => any
}
export default function CommentView(props: viewProps) {
     const classes = useStyles();
     const { commentItem, recommentItem,handleEditComment,handleDelete,getReComment } = props;

     const [item, setItem] = useState<commentInfo>()

     useEffect(() => {
          if( commentItem ) setItem(commentItem)
          else if(recommentItem) setItem(recommentItem)
     }, [commentItem,recommentItem])
     return (
          <>
          {item &&
               <>
               <div>
          {/* 작성자 */} <li>{item.user.slice(0,4) + "****"}</li>      
          {/* 내용 */}   <li>{item.comment_content}</li>
          {/* 시간 */}   <li>{item.date}</li>
          {/* 답글 */}   {commentItem && <Button onClick={() => getReComment(item.comment_id)}>답글</Button>}
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
          {/* 수정, 삭제 버튼 */}
                    { item.editable &&
                         <div>
                              <IconButton onClick={() => {
                                   if(commentItem) handleEditComment(item.comment_id)
                                   else console.log('답글 수정')
                                   }}><EditIcon /></IconButton>
                              <IconButton onClick={() => {
                                   if(commentItem) handleDelete(item.comment_id)
                                   else console.log('답글 삭제')
                                   }}><DeleteForeverIcon /></IconButton>
                         </div>  
                    }
               </>
               }
          </>
          )
}
