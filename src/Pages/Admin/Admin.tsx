import { useState, useEffect } from "react";
import axios from "axios";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";

import { userInfo } from "Interface/User";
import { statisticsInfo } from "Interface/Admin";

import AdminNav from "./AdminNav";
import UserAdmin from "./UserAdmin/UserAdmin";
import CategoryAdmin from "./CategoryAdmin/CategoryAdmin";
import FaqAdmin from "./FaqAdmin/FaqAdmin";
import PointAdmin from "./PointAdmin/PointAdmin";
import P2PAdmin from "./P2PAdmin/P2PAdmin";
import BoardAdmin from "./BoardAdmin/BoardAdmin";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      height: "100%",
    },
    statCard: {
      display: "inline-block",
      padding: "40px",
      marginRight: "10px",
      borderRadius: "20px",
      "& h1": {
        margin: 0,
      },
    },
  })
);
interface AdminProps {
  userObj: userInfo;
  isAdmin: boolean;
  typeNum: string;
  typeName: string;
}
export default function Admin(props: AdminProps) {
  const { userObj, isAdmin, typeNum } = props;
  const classes = useStyles();

  const checkAccess = () => {
    alert("권한이 주어진 사용자만 이용 가능합니다.");
    window.location.href = "/";
  };

  const [statList, setStatList] = useState<statisticsInfo>();
  const getDailyStatistics = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/admin/user/user_statics`, {
        headers: {
          Authorization: "Token " + userObj.auth_token,
        },
      })
      .then((res) => {
        // console.log(res.data)
        setStatList(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getDailyStatistics();
  }, []);
  return (
    // 1. props로 받아온 typeNum 을 통해 페이지 라우팅 설계
    // 2. 각 페이지 컴포넌트들(UserAdmin, CategoryAdmin, .. ) 은 index를 통해 내부 라우팅 설계
    // + 그외 기능 컴포넌트는(DELETE, EDIT, ..) querystring을 이용하여 설계
    <>
      {userObj && isAdmin && window.location.pathname.includes("/admin") ? (
        <>
          <div className={classes.root}>
            {/* 좌측 메뉴 목록 */}
            <AdminNav userObj={userObj} />

            {/* 관리 컴포넌트 */}
            <main className={classes.content}>
              <div className={classes.toolbar} />
              {typeNum === "01" ? (
                <div style={{ margin: "0 auto" }}>
                  <Card className={classes.statCard}>
                    <span color="primary">신규가입자</span>
                    <h1>{statList?.new_user} 명</h1>
                  </Card>
                  <Card className={classes.statCard}>
                    <span color="primary">누적회원수</span>
                    <h1>{statList?.total_user} 명</h1>
                  </Card>
                  <Card className={classes.statCard}>
                    <span color="primary">탈퇴회원수</span>
                    <h1>{statList?.withdrawal_user} 명</h1>
                  </Card>
                </div>
              ) : typeNum === "02" ? (
                <UserAdmin userObj={userObj} />
              ) : typeNum === "03" ? (
                <CategoryAdmin userObj={userObj} />
              ) : typeNum === "04" ? (
                <FaqAdmin userObj={userObj} />
              ) : typeNum === "05" ? (
                <PointAdmin userObj={userObj} />
              ) : typeNum === "06" ? (
                <P2PAdmin userObj={userObj} />
              ) : typeNum === "07" ? (
                <BoardAdmin userObj={userObj} />
              ) : null}
            </main>
          </div>
        </>
      ) : (
        checkAccess()
      )}
    </>
  );
}
