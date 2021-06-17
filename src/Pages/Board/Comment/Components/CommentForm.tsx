import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, TextField, Button } from "@material-ui/core/";
import { userInfo } from "Interface/User";
import { commentInfo } from "Interface/Board";

interface formProps {
  postId?: number; // 게시글 id
  parentId?: number; // 답글 상위 댓글 id
  userObj: userInfo | null;

  commentItem?: commentInfo; // 수정 중인 댓글 데이터
  recommentItem?: commentInfo; // 수정 중인 답글 데이터

  handleUpdateComment: () => void; // 댓글 업데이트 함수
  handleEdit?: (commentId?: number) => void;
  handleUpdateReComment?: (parendId: number) => void; // 답글 업데이트 함수
  handleAlertClose: () => void;
}
export default function CommentForm(props: formProps) {
  const {
    parentId,
    userObj,
    postId,
    commentItem,
    recommentItem,
    handleUpdateComment,
    handleUpdateReComment,
    handleEdit,
    handleAlertClose,
  } = props;
  const [comment, setComment] = useState("");
  const [recomment, setRecomment] = useState("");

  // 댓글, 답글 입력 값 처리 함수
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    parent_Id?: number
  ) => {
    // parentId 속성이 존재하면 답글, 없으면 댓글
    if (userObj === null) {
      handleAlertClose();
    } else {
      if (parentId) {
        setRecomment(event.target.value);
      } else {
        setComment(event.target.value);
      }
    }
  };
  // 댓글, 답글 저장 및 수정 함수
  const handleSubmit = (parentId?: number) => {
    let canSubmit = false;
    let url = "write_comment";
    let data;

    if (userObj !== null) {
      if (parentId) {
        // 1. 답글
        if (recommentItem) {
          url = "update_comment";
          data = {
            comment_id: recommentItem.comment_id,
            comment_content: recomment,
          };
          canSubmit = true;
        } else {
          if (recomment.length < 3) {
            alert("3자 이상 입력해주세요.");
          } else {
            data = {
              post_id: postId,
              comment_content: recomment,
              parent_comment: parentId,
            }; // 답글 일때 보낼 데이터
            canSubmit = true;
          }
        }
      } else {
        // 2. 댓글
        if (commentItem) {
          url = "update_comment";
          data = {
            comment_id: commentItem.comment_id,
            comment_content: comment,
          }; // 수정할 댓글 데이터
          canSubmit = true;
        } else {
          if (comment.length < 3) {
            alert("3자 이상 입력해주세요.");
          } else {
            data = {
              post_id: postId,
              comment_content: comment,
            }; // 댓글 일때 보낼 데이터
            canSubmit = true;
          }
        }
      }
      if (canSubmit) {
        axios
          .post(`${process.env.REACT_APP_SERVER}/api/notice/${url}`, data, {
            headers: {
              Authorization: "Token " + userObj.auth_token,
            },
          })
          .then((res) => {
            if (parentId && handleUpdateReComment) {
              // 답글일 경우 답글 초기화 및 업데이트
              setRecomment("");
              if (handleEdit) handleEdit();
              if (handleUpdateReComment) handleUpdateReComment(parentId);
            } else {
              setComment("");
              if (commentItem && handleEdit) {
                // 댓글일 경우 댓글 초기화 및 업데이트
                handleEdit();
              }
            }
            handleUpdateComment();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      handleAlertClose();
    }
  };

  useEffect(() => {
    if (commentItem) {
      setComment(commentItem.comment_content);
    } else if (recommentItem) {
      setRecomment(recommentItem.comment_content);
    }
  }, [commentItem, recommentItem]);

  return (
    <>
      {/* 댓글, 답글 폼 */}
      <Typography
        component="div"
        style={{ border: "1px solid #D0D0D0", padding: "15px" }}
      >
        <b>{userObj?.email.split("@")[0]}</b>
        <TextField
          value={comment ? comment : recomment}
          id="contentField"
          label="무관한 내용이나 악성 댓글은 삭제될 수 있습니다."
          multiline
          rows={3}
          fullWidth
          onChange={handleChange}
        />
      </Typography>
      <Typography component="div" align="right">
        <Button onClick={() => handleSubmit(parentId)}>등록</Button>
      </Typography>
    </>
  );
}
