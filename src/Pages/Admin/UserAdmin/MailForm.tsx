import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { userInfo } from "Interface/User";
import { memberInfo } from "Interface/Admin";

const useStyles = makeStyles({
  mailForm: {
    padding: "10px",
    "& div": {
      marginBottom: "10px",
    },
  },
});
interface MailFormProps {
  userObj: userInfo;
  selectedUser: memberInfo[];

  handleIsUpdated: () => void;
}
export default function MailForm(props: MailFormProps) {
  const { userObj, selectedUser, handleIsUpdated } = props;
  const classes = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    let emailList = selectedUser.map((data) => data.email);
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/admin/user/send_mail`,
        {
          send_mail: emailList,
          email_title: title,
          email_content: content,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        alert("메일 전송이 완료되었습니다.");
        history.push("/admin/user_admin/mail", {
          index: 2,
        });
        handleIsUpdated();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/admin/user_admin/mail", {
      index: 2,
    });
    handleIsUpdated();
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>새 메일 작성</h2>
        <div>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            메일 전송
          </Button>
          <Button color="primary" variant="contained" onClick={handleCancel}>
            돌아가기
          </Button>
        </div>
      </div>

      <form className={classes.mailForm}>
        <div>
          <TextField
            id="standard-basic"
            label="메일 제목"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.currentTarget.value)
            }
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={20}
            defaultValue="메일 내용을 작성해주십시오."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContent(e.currentTarget.value)
            }
          />
        </div>
      </form>
    </>
  );
}
