import React, { useState } from "react";
import { useHistory } from "react-router";

import { userInfo } from "Interface/User";
import {
  Container,
  makeStyles,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@material-ui/core";

const useStyles = makeStyles({
  userContainer: {
    padding: "100px",
  },
  userContainerMobile: {
    padding: "50px 20px",
    marginTop: "70px",
  },
  editPWForm: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    padding: "10px",
    "& button": {
      marginTop: "15px",
    },
  },
  withDrawalContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    "& > button": {
      marginBottom: "20px",
    },
  },
});

interface MyPageProps {
  userObj: userInfo;

  handleWithdrawal: () => void;
}

export default function MyPage(props: MyPageProps) {
  const classes = useStyles();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 380px)");

  const [error, setError] = useState(new Map());

  const [isWithDrawal, setIsWithDrawal] = useState(false);
  const handleError = (errorId: string, message: string) => {
    if (errorId === "current_password") {
      setError(
        (prev) =>
          new Map([
            ...Array.from(prev),
            [errorId, "현재 비밀번호가 일치하지 않습니다."],
          ])
      );
    } else {
      setError((prev) => new Map([...Array.from(prev), [errorId, message]]));
    }
  };

  /**
   * 비밀번호 입력 폼 처리 함수
   */
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.id === "prevPassword") {
      setPassword(value);
    } else setNewPassword(value);
  };

  /**
   * 회원 탈퇴 or 비밀번호 변경 기능 처리 함수
   * @param e MoustEvent
   */
  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    let button = e.currentTarget.id;

    if (button === "withDrawButton") {
      fetch(`${process.env.REACT_APP_SERVER}/api/auth/withdrawal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Token " + props.userObj.auth_token,
        },
      })
        .then((res) => {
          if (res.ok) {
            alert(
              "그동안 데일리 나우를 이용해주셔서 감사합니다, 탈퇴가 완료되었습니다."
            );
            props.handleWithdrawal();
            history.push("/");
            window.sessionStorage.clear();
          } else alert("탈퇴에 실패했습니다.");
        })
        .catch((error) => console.log(error));
    } else {
      const passwordInfo = {
        current_password: password,
        new_password: newPassword,
      };

      fetch(`${process.env.REACT_APP_SERVER}/api/auth/password_change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Token " + props.userObj.auth_token,
        },
        body: JSON.stringify(passwordInfo),
      })
        .then((res) => {
          if (res.ok) {
            alert("비밀번호 변경이 완료되었습니다.");
            history.push("/");
          } else {
            alert("비밀번호 변경을 실패하였습니다.");
            res.json().then((data) => {
              for (let [key, value] of Object.entries(data)) {
                handleError(`${key}`, `${value}`);
              }
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const inputList = [
    {
      id: "prevPassword",
      helperId: "prev-text",
      type: "password",
      labelContent: "현 비밀번호",
      helperText: "current password",
      errorId: "current_password",
    },
    {
      id: "newPassword",
      helperId: "new-text",
      type: "password",
      labelContent: "새 비밀번호",
      helperText: "new password",
      errorId: "new_password",
    },
  ];

  return (
    <Container
      className={isMobile ? classes.userContainerMobile : classes.userContainer}
      maxWidth="md"
    >
      <div>
        {" "}
        <Typography variant="h5">🔐 회원 정보 수정</Typography>{" "}
      </div>

      {/* 비밀번호 변경 박스 */}
      <div className="editBox">
        <form className={classes.editPWForm}>
          {inputList.map((item, index) => {
            return (
              <FormControl
                key={index}
                error={
                  item.errorId && error.has(item.errorId) ? true : undefined
                }
              >
                <InputLabel>{item.labelContent}</InputLabel>
                <Input id={item.id} type={item.type} onChange={onChange} />
                <FormHelperText>
                  {item.errorId && error.has(item.errorId)
                    ? error.get(`${item.errorId}`)
                    : `Enter your ${item.helperText}`}
                </FormHelperText>
              </FormControl>
            );
          })}
          <Button
            variant="contained"
            color="primary"
            id="pwButton"
            type="submit"
            onClick={onSubmit}
          >
            변경하기
          </Button>
        </form>
      </div>

      {/* 회원 탈퇴 */}
      <div className={classes.withDrawalContainer}>
        <Button
          variant="outlined"
          color="secondary"
          type="submit"
          onClick={() => setIsWithDrawal(true)}
        >
          회원 탈퇴
        </Button>
        <Dialog
          open={isWithDrawal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">회원 탈퇴</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              정말 떠나시는 건가요? 한번 더 생각해보지 않으시겠어요? 😥
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" id="withDrawButton" onClick={onSubmit}>
              탈퇴하기
            </Button>
            <Button onClick={() => setIsWithDrawal(false)} autoFocus>
              돌아가기
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="outlined" onClick={() => history.goBack()}>
          돌아가기
        </Button>
      </div>
    </Container>
  );
}
