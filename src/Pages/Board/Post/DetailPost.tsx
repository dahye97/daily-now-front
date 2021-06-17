import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  IconButton,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
  useMediaQuery,
} from "@material-ui/core/";

import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import { commentInfo, detailPostInfo } from "Interface/Board";
import { userInfo } from "Interface/User";
import Comment from "../Comment/Comment";
import WelcomeLoginAlert from "Components/Alert/WelcomeLoginAlert";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 600,
    background: "#fafafa",
    "& th": {
      color: "#9e9e9e",
    },
  },
  contentPaper: {
    padding: "30px",
    margin: "10px",
  },
  contentPaperMobile: {
    padding: "30px",
  },
  commentItem: {
    borderBottom: "3px solid #fafafa",
  },
  handButton: {
    textAlign: "center",
    paddingTop: "30px",
  },
  button: {
    color: "#ffb303",
  },
  disabledButton: {
    color: "#cfcfcf",
  },
});

interface Column {
  id: "date" | "title" | "author" | "visited" | "like" | "unlike";
  label: string | number;
  maxWidth?: string;
  align?: "left" | "right";
}

interface stateType {
  post_id: number;
  category_id: number;
}

export const createDate = (date: string) => {
  const splitData = date.split("T");
  const newDate = splitData[0].replaceAll("-", ".");
  const newTime = splitData[1].split(".")[0];
  return newDate + " " + newTime;
};

export default function DetailPost(props: { userObj: userInfo | null }) {
  const { userObj } = props;
  const classes = useStyles();
  const location = useLocation<stateType>();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 380px)");

  /**
   * 로그인 안내창 토글러
   */
  const [alertOpen, setAlertOpen] = useState(false);
  const handleAlertClose = () => {
    setAlertOpen(!alertOpen);
  };

  /**
   *  선택한 게시물 행 데이터 생성 함수
   */
  const [columns, setColumns] = useState<Column[]>([]);
  const [mobileCol, setMobileCol] = useState<Column[]>([]);
  const createRow = (start: number, end: number) => {
    return (
      <TableRow style={{ display: "flex", justifyContent: "flex-start" }}>
        {(isMobile ? mobileCol : columns).slice(start, end).map((column) => {
          return (
            <TableCell
              component="th"
              scope="row"
              key={column.id}
              style={{
                width: column.maxWidth,
                border: "none",
                padding: "10px",
              }}
              align={column.align}
              {...(column.id === "title"
                ? {
                    style: {
                      width: column.maxWidth,
                      border: "none",
                      padding: "10px",
                      color: "black",
                    },
                  }
                : {})}
            >
              {column.label}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  /**
   * 선택한 게시물 작성 정보 데이터 불러오기
   */
  const [isLoading, setIsLoading] = useState(true);
  const [detailPost, setDetailPost] = useState<detailPostInfo>(Object);
  const getDetailData = () => {
    let headerData = {};

    if (userObj !== null) {
      headerData = {
        headers: {
          Authorization: "Token " + userObj.auth_token,
        },
      };
    }
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/notice/detail_post`,
        {
          post_id: location.state.post_id,
        },
        headerData
      )
      .then((res) => {
        setDetailPost(res.data);
        setColumns([
          {
            id: "title",
            align: "left",
            label: res.data.title,
            maxWidth: "70%",
          },
          {
            id: "visited",
            align: "right",
            label: "조회 " + res.data.views,
            maxWidth: "30%",
          },
          {
            id: "like",
            align: "right",
            label: "공감 " + res.data.like,
            maxWidth: "10%",
          },
          {
            id: "unlike",
            align: "right",
            label: "비공감 " + res.data.dislike,
            maxWidth: "10%",
          },
          {
            id: "author",
            align: "left",
            label: res.data.user.slice(0, 4) + "****",
            maxWidth: "50%",
          },
          {
            id: "date",
            align: "right",
            label: createDate(res.data.date),
            maxWidth: "50%",
          },
        ]);
        setMobileCol([
          {
            id: "title",
            align: "left",
            label: res.data.title,
            maxWidth: "70%",
          },
          {
            id: "author",
            align: "left",
            label: res.data.user.slice(0, 4) + "****",
            maxWidth: "20%",
          },
          {
            id: "date",
            align: "right",
            label: createDate(res.data.date),
            maxWidth: "40%",
          },
          {
            id: "visited",
            align: "right",
            label: "조회 " + res.data.views,
            maxWidth: "20%",
          },
        ]);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  /**
   * 댓글 리스트 불러오기
   * 로그인 O : 헤더 전송 O, 로그인 X : 헤더 전송 X
   */
  const [commentList, setCommentList] = useState<commentInfo[]>([]);
  const getCommentList = () => {
    let headerData;
    if (userObj !== null) {
      headerData = {
        Authorization: "Token " + userObj.auth_token,
      };
    }

    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/notice/comment_list`,
        {
          post_id: location.state.post_id,
        },
        {
          headers: headerData,
        }
      )
      .then((res) => {
        // console.log(res.data)
        setCommentList(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getCommentList();
  }, []);

  // 공감 비공감 처리 state
  const [isClicked, setIsClicked] = useState(false);
  const [pressableLike, setPressableLike] = useState(false);
  const [pressableDislike, setPressableDislike] = useState(false);

  const handleLikeDisLike = (event: React.MouseEvent) => {
    let label = event.currentTarget.getAttribute("aria-label"); // 현재 선택한 값 라벨 확인 : like, dislike
    let queryString; // like, dislike 별 지정 url 값 저장 - 서버에 전달
    let likeDislike = -1; // 공감,비공감 여부 - 서버에 전달

    if (userObj !== null) {
      if (detailPost.like_dislike === -1) {
        // -1 : 공감 또는 비공감이 없을 경우
        queryString = "add_post_like";
        if (label === "like") {
          likeDislike = 1;
          setPressableLike(true);
        } else if (label === "dislike") {
          likeDislike = 0;
          setPressableDislike(true);
        }
      } else {
        // 0 or 1 : 공감 또는 비공감이 존재할 경우
        if (label === "like") {
          if (detailPost.like_dislike === 1) {
            likeDislike = 1;
            queryString = "cancel_post_like";
            setPressableLike(false);
          } else {
            alert("이미 비공감을 하셨습니다.");
          }
        } else if (label === "dislike") {
          if (detailPost.like_dislike === 0) {
            likeDislike = 0;
            queryString = "cancel_post_like";
            setPressableDislike(false);
          } else {
            alert("이미 공감을 하셨습니다.");
          }
        }
      }
      // add,cancel 결과
      if (likeDislike !== -1) {
        axios
          .post(
            `${process.env.REACT_APP_SERVER}/api/notice/${queryString}`,
            {
              post_id: location.state.post_id,
              like_dislike: likeDislike,
            },
            {
              headers: {
                Authorization: "Token " + userObj.auth_token,
              },
            }
          )
          .then((res) => {
            // console.log(res)
            setIsClicked(!isClicked);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      handleAlertClose();
    }
  };

  /**
   * 공감, 비공감 실시간 업데이트를 위한 effect
   * (공감 비공감 view 만 가지고 오는 api 없음)
   */
  useEffect(() => {
    getDetailData();
  }, [isClicked]);

  /**
   * 게시물에 대해 유저가 선택한 공감/비공감 정보 데이터 업데이트
   */
  useEffect(() => {
    if (detailPost.like_dislike === 1) {
      setPressableLike(true);
    } else if (detailPost.like_dislike === 0) {
      setPressableDislike(true);
    }
  }, [detailPost]);

  /**
   * 댓글 추가 실시간 업데이트 처리 함수
   */
  const handleUpdateComment = () => {
    getCommentList();
  };

  // 게시글 수정, 삭제 함수
  const handleEditPost = () => {
    history.push(`/board/write/${detailPost.post_id}`, {
      // 수정할 게시물 정보
      detailPost: detailPost,
    });
  };
  const handleDelete = () => {
    if (userObj !== null) {
      axios
        .post(
          `${process.env.REACT_APP_SERVER}/api/notice/delete_post`,
          {
            post_id: detailPost.post_id,
            title: detailPost.title,
            content: detailPost.content,
          },
          {
            headers: {
              Authorization: "Token " + userObj.auth_token,
            },
          }
        )
        .then((res) => {
          alert("게시물이 삭제되었습니다.");
          history.goBack();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {!isLoading ? (
              isMobile ? (
                <>
                  {createRow(0, 1)}
                  {createRow(1, 4)}
                </>
              ) : (
                <>
                  {createRow(0, 4)}
                  {createRow(4, 6)}
                </>
              )
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 글 내용 */}
      <Paper
        className={isMobile ? classes.contentPaperMobile : classes.contentPaper}
      >
        {detailPost.content}

        {/* 공감,비공감 버튼 */}
        <Typography component="div" className={classes.handButton}>
          <IconButton
            className={pressableLike ? classes.button : classes.disabledButton}
            onClick={handleLikeDisLike}
            aria-label="like"
          >
            <ThumbUpAltIcon />
          </IconButton>
          <IconButton
            className={
              pressableDislike ? classes.button : classes.disabledButton
            }
            onClick={handleLikeDisLike}
            aria-label="dislike"
          >
            <ThumbDownIcon />
          </IconButton>
        </Typography>

        <Typography component="div" align="right">
          {/* 수정, 삭제 버튼 */}
          {detailPost.editable && (
            <>
              <IconButton onClick={handleEditPost}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteForeverIcon />
              </IconButton>
            </>
          )}
          {/* 목록 버튼 */}
          <IconButton onClick={() => history.goBack()}>
            <KeyboardBackspaceIcon />
          </IconButton>
        </Typography>
      </Paper>

      {/* 댓글 창 */}
      <Comment
        userObj={userObj}
        commentList={commentList}
        postId={location.state.post_id}
        handleUpdateComment={handleUpdateComment}
        handleAlertClose={handleAlertClose}
      />

      <WelcomeLoginAlert open={alertOpen} />
    </Paper>
  );
}
