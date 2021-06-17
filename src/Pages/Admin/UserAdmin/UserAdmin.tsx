import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import axios from "axios";
import queryString from "query-string";

import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/styles";
import { DataGrid, GridColDef, GridRowId } from "@material-ui/data-grid";
import { Button, IconButton } from "@material-ui/core";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";

import { userInfo } from "Interface/User";
import { memberDataInfo, memberInfo } from "Interface/Admin";
import Mail from "./Mail";
import UserStatistics from "./UserStatistics";
import UserForm from "./UserForm";
import UserDelete from "./UserDelete";
import UserSearch from "./UserSearch";

interface UserAdminProps {
  userObj: userInfo;
}
interface locationProps {
  index: number;
}

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
    "& > ul": {
      flexWrap: "nowrap",
    },
  },
});
export default function UserAdmin(props: UserAdminProps) {
  const classes = useStyles();

  const location = useLocation<locationProps>();
  const { userObj } = props;
  const index = location.state.index; // 1: 일일 회원 통계, 2: 메일 전송
  const history = useHistory();

  const queryObj = queryString.parse(location.search);
  const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기

  const keyword = queryObj.keyword;
  const type = queryObj.type;
  const pageIndex = queryObj.page;

  // 표시할 글 수
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRowsPerPage(+(event.target.value as number));
  };
  // 회원 정보 업데이트를 위한 핸들러
  const [isUpdated, setIsUpdated] = useState(false);
  const handleIsUpdated = () => {
    setIsUpdated(!isUpdated);
  };

  useEffect(() => {
    if (isUpdated) {
      getUserList(rowsPerPage, null, null);
      handleIsUpdated();
    }
  }, [isUpdated]);
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "username",
      headerName: "이름",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      type: "email",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date_joined",
      headerName: "가입일자",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "num_post",
      headerName: "게시글 수",
      type: "number",
      width: 150,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "num_comment",
      headerName: "댓글 수",
      type: "number",
      width: 150,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "total_point",
      headerName: "누적 포인트",
      type: "number",
      width: 150,
      align: "right",
      headerAlign: "center",
    },
  ];

  const [userList, setUserList] = useState<memberDataInfo>(Object);
  const [previousUrl, setPreviousUrl] = useState(""); // 이전 페이지 URL
  const [nextUrl, setNextUrl] = useState(""); // 다음 페이지 URL

  const { count, results } = userList;

  const [page, setPage] = React.useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const handleIsSearching = (value: boolean) => {
    setIsSearching(value);
  };

  // 앞, 뒤 게시물 페이지 이동
  const handleChangePage = (event: React.ChangeEvent<any>, newPage: number) => {
    let label = event.currentTarget.getAttribute("aria-label");
    let nextPage = newPage;

    // 검색 중인지 페이지 이동중인지 구분
    if (keyword) handleIsSearching(true);
    else handleIsSearching(false);

    if (newPage > page) {
      // 다음페이지로 이동
      getUserList(rowsPerPage, type, keyword, nextUrl, newPage);
    } else if (newPage < page) {
      // 이전 페이지로 이동
      getUserList(rowsPerPage, type, keyword, previousUrl, newPage);
    }

    // '>, <' 버튼 선택 시 URL 및 10페이지 씩 이동 처리하기 위한 코드
    if (["Go to next page", "Go to previous page"].includes(label)) {
      if (newPage > page) {
        nextPage += 9;
      } else nextPage -= 9;
      if (nextPage > Math.floor(count / rowsPerPage + 1)) {
        nextPage = Math.floor(count / rowsPerPage + 1);
      } else if (nextPage < 1) {
        nextPage = 1;
      }
    }
    setPage(nextPage);

    history.push(
      `/admin/user_admin?keyword=${keyword}&type=${type}&page=${nextPage}`,
      {
        index: 0,
      }
    );
    window.scrollTo(0, 0);
  };

  const getUserList = (
    size: number,
    type: string | string[] | null,
    keyword: string | string[] | null,
    url?: string,
    pageIndex?: number
  ) => {
    let baseurl = `${process.env.REACT_APP_SERVER}/api/admin/user/user_list`;
    if (url) baseurl = baseurl + `?page=${pageIndex}`;

    axios
      .post(
        baseurl,
        {
          page_size: size,
          search_type: type === "" ? null : type,
          search_keyword: keyword === "" ? null : keyword,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        // console.log(res.data.results)
        setUserList(res.data);

        setNextUrl(res.data.next);
        setPreviousUrl(res.data.previous);

        setSelectList(res.data.results);

        history.push(
          `/admin/user_admin?keyword=${keyword}&type=${type}&page=${pageIndex}`,
          {
            index: 0,
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    if (index === 0) {
      getUserList(rowsPerPage, null, null);
    }
  }, [index]);

  const [selectList, setSelectList] = useState<memberInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<memberInfo[]>([]);
  const handleSelect = (data: { selectionModel: GridRowId[] }) => {
    setSelectedUser(
      data.selectionModel.map((ele: any) => {
        return selectList.filter((r) => r.id === ele)[0];
      })
    );
  };
  useEffect(() => {
    console.log("선택한 유저", selectedUser);
  }, [selectedUser]);

  const handleUserToDelete = () => {
    history.push("/admin/user_admin?tabName=DELETE_USER", {
      index: index,
    });
  };

  const handleUserToEdit = () => {
    if (selectedUser.length === 1) {
      history.push("/admin/user_admin?tabName=EDIT_USER", {
        index: index,
      });
    } else {
      alert("정보 수정을 원하는 사용자 1명을 선택해주세요.");
    }
  };

  return (
    <div>
      {index === 1 ? (
        <UserStatistics userObj={userObj} index={index} />
      ) : index === 2 ? (
        <Mail
          userList={userList}
          userObj={userObj}
          getUserList={getUserList}
          index={index}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : tabName === "EDIT_USER" ? (
        <UserForm
          userObj={userObj}
          selectedUser={selectedUser}
          handleIsUpdated={handleIsUpdated}
        />
      ) : tabName === "DELETE_USER" ? (
        <UserDelete
          userObj={userObj}
          selectedUser={selectedUser}
          handleIsUpdated={handleIsUpdated}
        />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex" }}>
              <h2>회원 목록 조회</h2>
              <IconButton onClick={() => document.location.reload()}>
                <SettingsBackupRestoreIcon />
              </IconButton>
            </div>
            <div>
              <Button
                color="primary"
                variant="contained"
                onClick={handleUserToEdit}
              >
                선택 회원 수정
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleUserToDelete}
              >
                선택 회원 삭제
              </Button>
            </div>
          </div>

          {/* 회원 검색 컴포넌트 */}
          <UserSearch
            getUserList={getUserList}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleIsSearching={handleIsSearching}
          />

          {results && (
            <div style={{ width: "100%", height: "100vh" }}>
              <DataGrid
                rows={results}
                columns={columns}
                pageSize={rowsPerPage}
                checkboxSelection
                hideFooterPagination
                onSelectionModelChange={(itm: any) =>
                  handleSelect({ selectionModel: itm.selectionModel })
                }
              />

              <Pagination
                showFirstButton
                showLastButton
                className={classes.pagination}
                count={Math.floor(count / rowsPerPage) + 1}
                variant="outlined"
                color="primary"
                page={page}
                onChange={handleChangePage}
                defaultPage={1}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
