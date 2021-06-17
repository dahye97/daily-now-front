import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";

import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  useMediaQuery,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import logo from "asset/img/logo.webp";

const useStyles = makeStyles({
  authContainer: {
    padding: "100px",
    width: "100%",
    minWidth: "400px",
    height: "100vh",
  },
  authContainerMobile: {
    width: "100%",
    height: "100vh",
    paddingTop: "100px",
  },
  authBox: {
    padding: "50px 0",
    borderRadius: "50px",
    background: "#ffffff",
    boxShadow: "13px 13px 34px #b1b1b1, -13px -13px 34px #ffffff",
    overflow: "hidden",
    textAlign: "center",
    minWidth: "400px",
    minHeight: "800px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  authBoxMobile: {
    width: "90%",
    height: "100%",
    paddingTop: "20px",
    textAlign: "center",
  },
  registerForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "baseline",
    width: "350px",
    margin: "8px",
    justifyContent: "flex-start",
  },
  input: {
    width: "350px",
    fontSize: "13px",
    // color: 'red',
    fontWeight: 600,
  },
  emailInput: {
    width: "100%",
    marginRight: "10px",
  },
  button: {
    marginTop: "20px",
  },
});

export default function Registration() {
  const location = useLocation();
  const classes = useStyles();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 380px)");

  const queryObj = queryString.parse(location.search);
  const { share, ucode } = queryObj;

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [invitedCode, setInvitedCode] = useState<string | string[] | null>("");

  const [error, setError] = useState(Object);

  /**
   * 공유 URL 일시, 초대 코드 필드에 초대 코드 추가
   */
  useEffect(() => {
    if (share) {
      setInvitedCode(ucode);
    }
  }, [share]);

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    let registerInfo = {
      username: id,
      email: email + "@" + domain,
      password: password,
      code: invitedCode,
    };

    fetch(`${process.env.REACT_APP_SERVER}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(registerInfo), // json 데이터를 전송
    })
      .then((res) => {
        if (res.ok) {
          alert("회원가입이 완료되었습니다 :) ");
          res.json().then((data) => {
            window.sessionStorage.setItem("email", email);
            window.sessionStorage.setItem("username", data.username);
            window.sessionStorage.setItem("auth_token", data.auth_token);
          });
          window.location.reload();
          history.push("/");
        } else {
          res.json().then((data) => {
            setError(data);
            for (let elem in data) {
              document.getElementById(elem)?.setAttribute("error", "");
            }
          });
          alert("회원가입을 실패하였습니다.");
        }
      })
      .catch((error) => console.log(error));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (e.target.id) {
      case "userIdInput":
        setId(value);
        break;
      case "emailInput":
        setEmail(value);
        break;
      case "passwordInput":
        setPassword(value);
        break;
      case "checkpasswordInput":
        setCheckPw(value);
        break;
      case "ucodeInput":
        setInvitedCode(value);
        break;
    }
  };

  /**
   * 비밀번호 일치 확인 함수
   */
  const [checkError, setCheckError] = useState(false);
  const checkPassword = () => {
    if (password !== checkPw) {
      setCheckError(true);
    } else {
      setCheckError(false);
    }
  };
  useEffect(() => {
    if (checkPw.length !== 0) {
      checkPassword();
    }
  }, [checkPw]);

  /**
   * 직접 입력 필드 토글러
   */
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    setDomain("");
  };

  /**
   * 이메일 선택 리스트 토글러
   */
  const [selectOpen, setSelectOpen] = useState(false);
  const handleOpenSelect = () => {
    setSelectOpen(!selectOpen);
  };

  const inputList = [
    {
      id: "emailInput",
      type: "string",
      labelContent: "이메일 *",
      width: "100%",
      description: "email",
      errorId: "email",
    },
    {
      id: "userIdInput",
      type: "string",
      labelContent: "이름 *",
      description: "name",
      errorId: "username",
    },
    {
      id: "passwordInput",
      type: "password",
      labelContent: "비밀번호 *",
      description: "password",
      condition: "숫자와 문자를 포함한 8자 이상의 문자를 입력해주세요. ",
      errorId: "password",
    },
    {
      id: "checkpasswordInput",
      type: "password",
      labelContent: "비밀번호 재확인 *",
      description: "password",
      condition: "비밀번호를 재입력해주세요.",
    },
    {
      id: "ucodeInput",
      type: "ucode",
      labelContent: "초대 코드",
      description: "invited code",
      errorId: "ucode",
    },
  ];

  const domainList = [
    { id: 1, name: "naver.com" },
    { id: 2, name: "gmail.com" },
    { id: 3, name: "daum.net" },
    { id: 4, name: "nate.com" },
    { id: 5, name: "yahoo.co.kr" },
  ];
  const [domain, setDomain] = useState("");
  const handleChangeDomain = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === "nullEmail") {
      setDomain("");
    } else setDomain(event.target.value as string);
  };

  return (
    <Container
      className={isMobile ? classes.authContainerMobile : classes.authContainer}
    >
      <Container className={isMobile ? classes.authBoxMobile : classes.authBox}>
        <img src={logo} width="80px" alt="데일리나우와 함께해요!" />
        <h2>Daily Now 💙</h2>
        <p>
          매일이 행복한 투자
          <br />
          <b>데일리나우가</b> 함께 합니다
        </p>

        <form className={classes.registerForm}>
          {inputList.map((item, index) => {
            return (
              <div className={classes.inputBox}>
                <FormControl
                  key={index}
                  error={
                    error && item.errorId && error.hasOwnProperty(item.errorId)
                      ? true
                      : checkError && item.id === "checkpasswordInput"
                      ? true
                      : undefined
                  }
                >
                  {/* 입력 필드 */}
                  <InputLabel>{item.labelContent}</InputLabel>
                  <Input
                    placeholder={item.condition}
                    className={
                      item.id === "emailInput"
                        ? classes.emailInput
                        : classes.input
                    }
                    id={item.id}
                    type={item.type}
                    onChange={onChange}
                    {...(item.id === "ucodeInput" && ucode
                      ? { value: ucode }
                      : {})}
                  />

                  {/* Error 및 check Error 처리 */}
                  <FormHelperText>
                    {!isEmptyObject(error)
                      ? item.errorId && error.hasOwnProperty(item.errorId)
                        ? item.errorId === "ucode"
                          ? "유효한 초대코드가 아닙니다."
                          : error[`${item.errorId}`]
                        : `Enter your ${item.description}`
                      : item.id === "checkpasswordInput" &&
                        checkPw.length !== 0 &&
                        (checkError ? "일치하지 않습니다." : "일치합니다.")}
                  </FormHelperText>
                </FormControl>
                {item.id === "emailInput" && (
                  <>
                    <span style={{ width: "5%", display: "inline-block" }}>
                      @
                    </span>
                    <FormControl style={{ width: "65%", minWidth: 170 }}>
                      {/* 직접 입력 필드 */}
                      <FormControl
                        {...(open
                          ? { style: { display: "inline-block" } }
                          : { style: { display: "none" } })}
                      >
                        <Input
                          value={domain}
                          onChange={handleChangeDomain}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                style={{ padding: 0 }}
                                onClick={handleOpen}
                              >
                                <ArrowDropDownIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      {/* 이메일 select 필드 */}
                      <Select
                        value={domain}
                        onChange={handleChangeDomain}
                        displayEmpty
                        open={selectOpen}
                        onOpen={handleOpenSelect}
                        onClose={handleOpenSelect}
                        {...(!open
                          ? { style: { display: "inline-block" } }
                          : { style: { display: "none" } })}
                      >
                        <MenuItem value="">
                          <em>선택해 주세요</em>
                        </MenuItem>
                        {domainList.map((domain) => {
                          return (
                            <MenuItem key={domain.id} value={domain.name}>
                              {domain.name}
                            </MenuItem>
                          );
                        })}
                        <MenuItem value="nullEmail" onClick={handleOpen}>
                          직접 입력
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}
              </div>
            );
          })}

          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              onClick={onSubmit}
            >
              함께하기
            </Button>
          </div>
        </form>
      </Container>
    </Container>
  );
}

function isEmptyObject(param: Object) {
  return Object.keys(param).length === 0 && param.constructor === Object;
}
