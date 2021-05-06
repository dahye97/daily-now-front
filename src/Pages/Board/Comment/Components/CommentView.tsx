import React,{useState,useEffect} from 'react'
import axios from 'axios';

import {IconButton,Typography,Button} from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { commentInfo } from 'Interface/Board'
import { userInfo } from 'Interface/User';
import { createDate } from 'Pages/Board/Post/DetailPost';

const useStyles = makeStyles({
     commentContainer : {
          padding: '20px',
          
          '& li' : {
               padding: '3px'
          }
     },
     handButton: {
          textAlign: "center",
     },
     button: {
          color: '#64b5f6',
          padding: '5px',
          fontSize: "1.2rem"
      },
      disabledButton: {
           color: '#cfcfcf',
           padding: '5px',
           fontSize: "1.2rem"
      }
})
interface viewProps {
     userObj : userInfo | null,
     commentItem?: commentInfo
     recommentItem?: commentInfo,
     
     handleEdit: (commendId? :number) => void,
     handleDelete : (commendId : number, parentId?: number) => void,
     handleUpdateComment: () => void,
     getReComment: (parentId: number | null, numberOfRecomment? : number) => void

}

type curCommentType = { 
     like: number,
     dislike : number,
     num_child: number
}
function CommentView(props: viewProps) {
     const classes = useStyles();
     const { userObj, commentItem, recommentItem, 
          handleEdit,handleDelete,getReComment
           } = props;

     const [item, setItem] = useState<commentInfo>()

      // 공감 비공감 처리 함수 
      const [isClicked, setIsClicked] = useState(false)
      const [pressableLike, setPressableLike] = useState(true)
      const [pressableDislike, setPressableDislike] = useState(true)

     // 댓글 or 답글 객체 item에 저장 
     useEffect(() => {
          if( commentItem !== undefined ) setItem(commentItem)
           else if( recommentItem !== undefined ) setItem(recommentItem)
     }, [commentItem, recommentItem])

     useEffect(() => {
          if( item !== undefined ) {
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
                     axios.post(`${process.env.REACT_APP_SERVER}/api/notice/${queryString}`, {
                         comment_id: commentId,
                         like_dislike : likeDislike
                    }, {
                         headers : {
                              "Authorization": "Token " + userObj.auth_token,
                         }
                    })
                    .then(res => {
                         console.log(res)
                         if (commentItem) { // 댓글에 대한 공감, 비공감
                              getDetailComment(commentId)

                         }else if( recommentItem ) { // 답글에 대한 공감, 비공감
                             getDetailComment(commentId)
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

      // fix 특정 댓글,답글 정보 불러오기 : 공감 비공감 처리시에만 유용함.
      const getDetailComment = (commentId: number) => {
          if(userObj!==null){
               axios.post(`${process.env.REACT_APP_SERVER}/api/notice/detail_comment`, {
                    comment_id: commentId
               },{
                    headers : {
                         "Authorization": "Token " + userObj.auth_token,
                    }
               } )
               .then(res => {
                    setItem(res.data)
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }

     return (
          <>
          {item &&
               <>
               <div className ={ classes.commentContainer}>
          {/* 작성자 */} <li style={{display:'flex', justifyContent:'space-between', alignItems: 'baseline'}}>
                              <span><b>{item.user.substr(0,4) + "****"}</b></span>
                                
          {/* 수정, 삭제 버튼 */}
                                   { item.editable &&
                                        <span>
                                             <IconButton onClick={() => {
                                                  handleEdit(item.comment_id)
                                                  }}><EditIcon /></IconButton>
                                             <IconButton onClick={() => {
                                                  if(recommentItem) {
                                                       handleDelete(item.comment_id, item.parent_comment)
                                                  }
                                                  else handleDelete(item.comment_id)
                                                  }}><DeleteForeverIcon /></IconButton>
                                        </span>  
                                        // fix 댓글 삭제 시 업데이트 문제
                                   }

                         </li>      
          {/* 내용 */}   <li style={{margin: '20px 0'}}>{item.comment_content}</li>
          {/* 시간 */}   <li style={{display:'flex', justifyContent:'space-between', alignItems: 'baseline'}}>
               
                              <span style={{color: '#9e9e9e'}}>{createDate(item.date)}</span>

          {/* 공감, 비공감 */}               
                          <Typography component="span" className={classes.handButton}>
                              <IconButton 
                              aria-label="like"
                              className={pressableLike ? classes.button : classes.disabledButton}
                              onClick={(e: React.MouseEvent) => handleLikeDisLike(e, item.comment_id)}
                              >
                                   <ThumbUpAltIcon  fontSize="small"/> {item.like}
                              </IconButton>
                              <IconButton 
                              aria-label="dislike"
                              className={pressableDislike ? classes.button : classes.disabledButton}
                              onClick={(e: React.MouseEvent) => handleLikeDisLike(e,item.comment_id)}
                              >
                                   <ThumbDownIcon  fontSize="small"/> {item.dislike}
                              </IconButton>
                         </Typography>
                              
                    </li>

                         <div  style={{display:"flex", justifyContent: "space-between",}}>
               {/* 답글 */}  {commentItem && <Button 
                              onClick={() => getReComment(item.comment_id, item.num_child)}>
                                   답글 {item.num_child} </Button>}
                         </div>
               </div>

               </>
               }
          </>
          )
}

export default React.memo(CommentView)