import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";

import { Button, TextField } from "@material-ui/core";
import { memberInfo } from "Interface/Admin";
import { userInfo } from "Interface/User";

interface UserFormProps {
  selectedUser: memberInfo[];
  userObj: userInfo;

  handleIsUpdated: () => void;
}

export default function UserForm(props: UserFormProps) {
  const { selectedUser, userObj, handleIsUpdated } = props;
  const history = useHistory();

  const [username, setUsername] = useState(selectedUser[0].username);
  const [email, setEmail] = useState(selectedUser[0].email);
  const handleSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/admin/user/user_info_update`,
        {
          email: selectedUser[0].email,
          new_email: email,
          new_username: username,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        history.push("/admin/user_admin", {
          index: 0,
        });
        handleIsUpdated();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleCancel = () => {
    history.push("/admin/user_admin", {
      index: 0,
    });
    handleIsUpdated();
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>유저 정보 수정 페이지</h2>
        <div>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            변경 저장
          </Button>
          <Button color="primary" variant="contained" onClick={handleCancel}>
            변경 취소
          </Button>
        </div>
      </div>
      <form style={{ padding: "20px" }}>
        <TextField
          label="이름"
          variant="outlined"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.currentTarget.value)
          }
        />
        <TextField
          label="이메일"
          variant="outlined"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
        />
      </form>
    </div>
  );
}
