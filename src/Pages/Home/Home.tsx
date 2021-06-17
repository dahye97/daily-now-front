/** @format */
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import queryString from "query-string";
import axios from "axios";

import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  IconButton,
  useMediaQuery,
  Container,
} from "@material-ui/core";
import UpIcon from "@material-ui/icons/KeyboardArrowUp";

import { p2pInfo, userInfo, accountInfo, fundInfo } from "Interface/User";
import Share from "Pages/Home/Profile/Share/Share";
import Profile from "Pages/Home/Profile/Profile";
import P2PList from "Pages/Home/Profile/Funding/P2P/P2PList";
import Balance from "Pages/Home/Profile/Funding/Balance";
import Point from "Pages/Home/Profile/Point/Point";
import BankAccount from "Pages/Home/Profile/Funding/BankAccount";
import UserAccount from "./Profile/Funding/Accounts/UserAccount";

const useStyles = makeStyles({
  home: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  homeContainer: {
    padding: "20px",
    marginTop: "80px",
    borderRadius: "50px",
    background: "#ffffff",
    boxShadow: "17px 17px 34px #b1b1b1, -17px -17px 34px #ffffff",
    overflow: "hidden",
  },
  homeContainerMobile: {
    margin: "0 auto",
    width: "100%",
    padding: 0,
    paddingTop: "80px",
  },
  asideContainer: {
    position: "sticky",
    top: "80px",
    marginTop: "80px",
  },

  contentList: {
    paddingLeft: "0",
    width: "100%",
  },
  contentItem: {
    color: "#616161",
    listStyle: "none",
    padding: "20px 0",
    margin: "20px 0",
    borderRadius: "42px",
    background: "#ffffff",
    boxShadow: "10px 10px 20px #bfbfbf, -10px -10px 20px #ffffff",

    "& h5": {
      padding: "20px",
    },
  },
  deposit: {
    display: "flex",
    justifyContent: "space-between",
  },
  UpButton: {
    position: "sticky",
    bottom: "10%",
    left: "5%",
    padding: "20px",
    color: "#ffffff",
    borderRadius: "50%",
    background: "#198BFB",
    boxShadow: "3px 3px 8px #167add",
    "&:hover": {
      background: "#004ba0",
    },
  },
});

interface HomeProps {
  userObj: userInfo;
  registeredP2PList: p2pInfo[];
  isP2PReady: boolean;

  handleLogOut: () => void;
  handleAddP2P: (data: p2pInfo[]) => void;
}

export default function Home(props: HomeProps) {
  const { userObj, isP2PReady, handleLogOut, handleAddP2P, registeredP2PList } =
    props;
  const classes = useStyles();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 380px)");

  const queryObj = queryString.parse(location.search);
  const tabName = queryObj.tabName;

  const [isHomeRefresh, setIsHomeRefresh] = useState(false);

  /**
   * 선택한 회사 정보 저장 핸들러
   */
  const [company, setCompany] = useState("all");
  const [companyID, setCompanyID] = useState(0);
  const [nickName, setNickName] = useState("");

  const handleCompany = (name: string) => {
    if (name === "all") setIsHomeRefresh(!isHomeRefresh);
    setCompany(name);
  };
  const handleCompanyID = (id: number) => {
    setCompanyID(id);
  };
  const handleNickName = (name: string) => {
    setNickName(name);
  };

  /**
   * 투자, 계좌 정보 저장 핸들러
   */
  const [account, setAccount] = useState<accountInfo | undefined>(Object);
  const [fund, setFund] = useState<fundInfo>(Object);

  const handleAccount = (account: accountInfo | undefined) => {
    setAccount(account);
  };
  const handleFund = (fund: fundInfo) => {
    setFund(fund);
  };

  /**
   * 선택된 회사의 계좌 내역 가져오기
   * @param p2pID 확인하려는 회사 p2pID
   * @param nickname 확인하려는 회사 nickname
   */
  const getAccountData = (
    p2pID: { company_id: number; refresh: number },
    nickname?: string
  ) => {
    let nickNameValue = nickName;
    if (nickname) nickNameValue = nickname;

    if (userObj !== null && nickNameValue) {
      fetch(`${process.env.REACT_APP_SERVER}/api/${nickNameValue}/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Token " + userObj.auth_token,
        },
        body: JSON.stringify(p2pID),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              handleAccount(data);
            });
          } else {
            handleAccount(undefined);
          }
        })
        .catch((error) => console.log("계좌 정보가 없습니다."));
    }
  };

  /**
   * 선택된 회사의 투자 내역 가져오기
   * @param p2pID 확인하려는 회사 p2pID
   * @param nickname 확인하려는 회사 nickname
   */
  const getBalanceData = (
    p2pID: { company_id: number; refresh: number },
    nickname?: string
  ) => {
    let nickNameValue = nickName;
    if (nickname) nickNameValue = nickname;

    if (userObj !== null && nickNameValue) {
      fetch(`${process.env.REACT_APP_SERVER}/api/${nickNameValue}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Token " + userObj.auth_token,
        },
        body: JSON.stringify(p2pID),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              handleFund(data);
            });
          } else {
            handleFund({
              total_investment: "-",
              number_of_investing_products: "-",
              residual_investment_price: "-",
            });
          }
        })
        .catch((error) => console.log("투자 정보가 없습니다."));
    }
  };

  const getUserDataOfCompany = (
    refresh: number,
    id?: number,
    nickname?: string
  ) => {
    let idValue = companyID;
    if (id) {
      idValue = id;
    }
    let p2pID = {
      company_id: idValue,
      refresh: refresh,
    };

    if (userObj !== null) {
      if (nickname) {
        // 계정 최초 등록 시, 닉네임을 이용해 계정 정보 가져옴.
        getAccountData(p2pID, nickname);
        getBalanceData(p2pID, nickname);
      } else {
        getAccountData(p2pID);
        getBalanceData(p2pID);
      }
    }
  };
  useEffect(() => {
    if (companyID !== 0) {
      getUserDataOfCompany(0, companyID);
    }
  }, [companyID]);

  /**
   * 위로가기 기능
   */
  const handleClickUpButton = () => {
    window.scrollTo(0, 0);
  };
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => {
    setScrollY(window.pageYOffset);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  /**
   * 연동 회사 추가 시 업데이트 State
   */
  const [P2PUpdated, setP2PUpdated] = useState(false);
  const handleP2PUpdated = () => {
    getMyPoint(); // 연동 회사 추가 시 포인트 획득
    setP2PUpdated(!P2PUpdated);
  };

  // 연동 회사 추가 시 업데이트 핸들러
  useEffect(() => {
    if (userObj !== null) {
      fetch(`${process.env.REACT_APP_SERVER}/api/register/registered_company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Token " + userObj.auth_token,
        },
        body: JSON.stringify({
          search_keyword: null,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log('등록된 계정 리스트: ', res)
          handleAddP2P(res);
        })
        .catch((error) => console.log(error));
    }
  }, [P2PUpdated]);

  /**
   * 사용자 포인트 조회 함수
   */
  const [myPoint, setMyPoint] = useState(0);
  const getMyPoint = () => {
    if (userObj !== null) {
      axios
        .get(`${process.env.REACT_APP_SERVER}/api/auth/my_point`, {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        })
        .then((res) => {
          setMyPoint(res.data.total_point);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Container
        className={classes.home}
        {...(!isMobile && { style: { minWidth: "680px" } })}
      >
        {/* 마이 페이지 */}
        <Container
          maxWidth="md"
          className={
            isMobile ? classes.homeContainerMobile : classes.homeContainer
          }
        >
          <Profile
            myPoint={myPoint}
            updatePoint={getMyPoint}
            userObj={userObj}
            handleLogOut={handleLogOut}
            companyID={companyID}
            getUserDataOfCompany={getUserDataOfCompany}
          />

          {/* 나의투자, 포인트 내역, 초대하기 */}
          {tabName === "MY_FUNDING" ? (
            <>
              <P2PList
                getUserDataOfCompany={getUserDataOfCompany}
                P2PList={registeredP2PList}
                userObj={userObj}
                handleCompanyID={handleCompanyID}
                handleCompany={handleCompany}
                handleAddP2P={handleAddP2P}
                handleNickName={handleNickName}
                handleP2PUpdated={handleP2PUpdated}
              />

              {isP2PReady ? ( // 연동 회사가 존재할 때
                company === "all" ? ( // 현재 위치 : HOME
                  <div style={{ padding: "20px", marginTop: "20px" }}>
                    <Typography
                      variant="h5"
                      style={{ textAlign: "center", color: "#616161" }}
                    >
                      DAILY NOW
                    </Typography>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#616161",
                        fontSize: "15px",
                      }}
                    >
                      💁🏻‍♀️ 아이디나 비밀번호가 변경되었을 경우, 회사 검색을 통해
                      업데이트 해주세요.
                    </p>
                    <UserAccount
                      isHomeRefresh={isHomeRefresh}
                      userObj={userObj}
                      allAccounts={registeredP2PList}
                      handleP2PUpdated={handleP2PUpdated}
                    />
                  </div>
                ) : (
                  // 현재 위치 : 특정 P2P 회사
                  <ul className={classes.contentList}>
                    <h2 style={{ textAlign: "center" }}>
                      {company !== "all" && `🏬 ${company}`}
                    </h2>
                    {account !== undefined ? ( // 보유 계좌가 있을 때
                      <>
                        {/* 보유 예치금 */}{" "}
                        <li className={classes.contentItem}>
                          <Typography className={classes.deposit} variant="h5">
                            💰 현 보유 예치금<span>{account?.deposit} 원</span>
                          </Typography>
                        </li>
                        <li className={classes.contentItem}>
                          <BankAccount account={account} />
                        </li>
                        {/* 잔고  */}{" "}
                        <li className={classes.contentItem}>
                          <Balance fund={fund} />
                        </li>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", color: "#616161" }}>
                        보유하신 계좌가 존재하지 않습니다.
                      </div>
                    )}
                  </ul>
                )
              ) : (
                // 연동한 회사가 존재하지 않을 때
                <div
                  style={{
                    textAlign: "center",
                    color: "#616161",
                    marginTop: "10px",
                  }}
                >
                  회사를 연동해주세요!
                </div>
              )}
            </>
          ) : tabName === "POINT_TOTAL" ? (
            <Point userObj={userObj} />
          ) : tabName === "INVITE" ? (
            <Share
              myPoint={myPoint}
              updatePoint={getMyPoint}
              userObj={userObj}
            />
          ) : null}
        </Container>
      </Container>
      {scrollY > 500 && (
        <IconButton onClick={handleClickUpButton} className={classes.UpButton}>
          <UpIcon />
        </IconButton>
      )}
    </>
  );
}
