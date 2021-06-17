import axios from "axios";
import { useHistory } from "react-router";
import { Button, ListItem, List, ListItemText } from "@material-ui/core";
import { memberInfo } from "Interface/Admin";
import { userInfo } from "Interface/User";

interface UserDeleteProps {
  selectedUser: memberInfo[];
  userObj: userInfo;

  handleIsUpdated: () => void;
}
export default function UserDelete(props: UserDeleteProps) {
  const { selectedUser, userObj, handleIsUpdated } = props;
  const history = useHistory();

  const handleSubmit = () => {
    let emailList = selectedUser.map((user) => user.email);
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/admin/user/user_delete`,
        {
          email: emailList,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        alert("탈퇴 처리 되었습니다.");
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
      <h2>유저 삭제 페이지</h2>

      {selectedUser.map((user) => {
        return (
          <List>
            <ListItem>
              <ListItemText
                primary={
                  <div>
                    {user.id} {user.username}
                  </div>
                }
                secondary={user.email}
              />
            </ListItem>
          </List>
        );
      })}

      <div>선택한 위 {selectedUser.length}명의 회원은 탈퇴 처리 됩니다.</div>

      <Button color="primary" variant="contained" onClick={handleSubmit}>
        회원 삭제
      </Button>
      <Button color="primary" variant="contained" onClick={handleCancel}>
        돌아가기
      </Button>
    </div>
  );
}
