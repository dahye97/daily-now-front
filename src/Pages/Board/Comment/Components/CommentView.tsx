import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useLocation } from 'react-router';

import {IconButton,Typography,Button} from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { commentInfo } from '../../../../Interface/Board'
import { userInfo } from '../../../../Interface/User';

const useStyles = makeStyles({
     handButton: {
          textAlign: "center",
          paddingTop: "30px",
     },
     button: {
          color: '#ffb303',
      },
      disabledButton: {
           color: '#cfcfcf'
      }
})
interface viewProps {
     userObj : userInfo | null,
     commentItem?: commentInfo
     recommentItem?: commentInfo,
     
     handleEdit: (commendId? :number) => void,
     handleDelete : (commendId : number) => void,
     handleUpdateComment: () => void,
     getReComment: (parentId: number | null) => void
}
interface stateProps {
     post_id: number
}
function CommentView(props: viewProps) {
     const classes = useStyles();
     const location = useLocation<stateProps>();
     const { userObj, commentItem, recommentItem, 
          handleEdit,handleDelete,getReComment,handleUpdateComment } = props;

     const [item, setItem] = useState<commentInfo>()

      // 공감 비공감 처리 함수 
      const [isClicked, setIsClicked] = useState(false)
      const [pressableLike, setPressableLike] = useState(true)
      const [pressableDislike, setPressableDislike] = useState(true)


     useEffect(() => {
          if( item ) {
               if(item.like_dislike === 1) { 
                    setPressableDislike(false)
               }
               else if (item.like_dislike === 0) { 
                    setPressableLike(false)
               }
          }
     }, [item])
      // 댓글 공감 비공감 처리 함수 
     const handleLikeDisLike = (event: React.MouseEvent, commentId: number) => {
          let queryString; // like, dislike 별 지정 url 값 저장
          let label = event.currentTarget.getAttribute('aria-label') // 현재 선택한 값 라벨 확인 : like, dislike
          let likeDislike = -1; // 공감,비공감 여부 초기값
          if (userObj !== null && item) {
                if( item.like_dislike === -1 ) { // 공감, 비공감 저장 : -1 = 공감, 비공감이 없을 경우
                    console.log('존재하는 공감비공감 없음 ')
                    queryString = "add_comment_like"
                    if( label === "like") {
                         likeDislike = 1
                         setPressableLike(true)
                    }else if (label === "dislike") {
                         likeDislike = 0
                         setPressableDislike(true)
                    }
               }else { // 공감, 비공감 취소 : 0 or 1 = 공감, 비공감 이미 했을 경우
                    queryString = "cancel_comment_like"
                    if( label === "like") {
                         if(item.like_dislike === 1) {
                              likeDislike = 1
                              setPressableLike(false)
                         }else {
                              alert('이미 비공감을 하셨습니다.')
                         }
                    }else if (label === "dislike") {
                         if(item.like_dislike === 0) {
                              likeDislike = 0
                              setPressableDislike(false)
                         }else {
                              alert('이미 공감을 하셨습니다.')
                         }
                    }
               }
               //  add,cancel 결과 
                if( likeDislike !== -1) {
                     axios.post(`http://192.168.0.69:8000/api/notice/${queryString}`, {
                         comment_id: commentId,
                         like_dislike : likeDislike
                    }, {
                         headers : {
                              "Authorization": "Token " + userObj.auth_token,
                         }
                    })
                    .then(res => {
                         console.log(res)
                         if (commentItem) {
                              handleUpdateComment()
                         }else if( recommentItem ) {
                              if(recommentItem.parent_comment !== null){
                                   getReComment(recommentItem.parent_comment)
                              }
                         }
                         setIsClicked(!isClicked)

                    })
                    .catch(function(error) {
                         console.log(error);
                    })
                }
          } else {
               alert('로그인 먼저 해주세요.')
          }
     }

      // 댓글 or 답글 객체 item에 저장 
      useEffect(() => {
          if( commentItem ) setItem(commentItem)
          else if(recommentItem) setItem(recommentItem)

     }, [commentItem, recommentItem])
     return (
          <>
          {item &&
               <>
               <div>
          {/* 작성자 */} <li>{item.user.substr(0,4) + "****"}</li>      
          {/* 내용 */}   <li>{item.comment_content}</li>
          {/* 시간 */}   <li>{item.date.split('T')[0].replaceAll('-','. ')}</li>
          {/* 답글 */}   {commentItem && <Button onClick={() => getReComment(item.comment_id)}>답글</Button>}
          {/* 공감, 비공감 */}
                         <Typography component="span" className={classes.handButton}>
                              <IconButton 
                              aria-label="like"
                              className={pressableLike ? classes.button : classes.disabledButton}
                              onClick={(e: React.MouseEvent) => handleLikeDisLike(e, item.comment_id)}
                              >
                                   <ThumbUpAltIcon /> {item.like}
                              </IconButton>
                              <IconButton 
                              aria-label="dislike"
                              className={pressableDislike ? classes.button : classes.disabledButton}
                              onClick={(e: React.MouseEvent) => handleLikeDisLike(e,item.comment_id)}
                              >
                                   <ThumbDownIcon /> {item.dislike}
                              </IconButton>
                         </Typography>
               </div>
          {/* 수정, 삭제 버튼 */}
                    { item.editable &&
                         <div>
                              <IconButton onClick={() => {
                                   handleEdit(item.comment_id)
                                   }}><EditIcon /></IconButton>
                              <IconButton onClick={() => {
                                    handleDelete(item.comment_id)
                                   }}><DeleteForeverIcon /></IconButton>
                         </div>  
                    }
               </>
               }
          </>
          )
}

export default React.memo(CommentView)