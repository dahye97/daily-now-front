import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
/**
 * FIXME: 여기서 부터 다시 수정
 */
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";

import { userInfo } from "Interface/User";
import { pointCategoryInfo } from "Interface/Admin";

interface CatFormProps {
  userObj: userInfo;
  selectedAction: pointCategoryInfo[];

  handleIsUpdated: () => void;
}

export default function PointForm(props: CatFormProps) {
  const { userObj, selectedAction, handleIsUpdated } = props;
  const history = useHistory();

  const [newAction, setNewAction] = useState("");
  const [newValue, setNewValue] = useState(1);
  const [newLimit, setNewLimit] = useState(1);

  const handleSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/admin/point/update_point_action`,
        {
          point_action_id: selectedAction[0].id,
          action: newAction,
          point_value: newValue,
          limit_number_of_day: newLimit,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        alert("포인트 이벤트 수정이 완료되었습니다.");
        handleIsUpdated();
        history.push("/admin/point_admin/category", {
          index: 1,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/admin/point_admin/category", {
      index: 1,
    });
  };

  return (
    <>
      <h2>포인트 Action 수정</h2>

      {selectedAction && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
          }}
        >
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel htmlFor="name">새 포인트 이름</InputLabel>
            <Input
              id="name"
              value={newAction}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewAction(e.currentTarget.value)
              }
            />
            <FormHelperText>
              변경하실 새로운 이벤트 이름을 입력해주세요.
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel htmlFor="name">지급할 새 포인트 값</InputLabel>
            <Input
              id="name"
              value={newValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewValue(e.currentTarget.value as unknown as number)
              }
            />
            <FormHelperText>
              변경하실 새로운 포인트 값을 입력해주세요.
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel htmlFor="name">새 일일 지급 제한 수</InputLabel>
            <Input
              id="name"
              value={newLimit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewLimit(e.currentTarget.value as unknown as number)
              }
            />
            <FormHelperText>
              변경하실 새로운 일일 지급 제한 수를 입력해주세요.
            </FormHelperText>
          </FormControl>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Button color="primary" variant="outlined" onClick={handleSubmit}>
          저장하기
        </Button>
        <Button color="primary" variant="outlined" onClick={handleCancel}>
          취소하기
        </Button>
      </div>
    </>
  );
}
