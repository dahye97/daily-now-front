import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";

import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowData,
} from "@material-ui/data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@material-ui/core";

import { categoryInfo } from "Interface/Board";
import { userInfo } from "Interface/User";
import CategoryForm from "./CategoryForm";

interface CatAdminProps {
  userObj: userInfo;
}

export default function CategoryAdmin(props: CatAdminProps) {
  const { userObj } = props;
  const history = useHistory();
  const location = useLocation();

  const queryObj = queryString.parse(location.search);
  const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기

  // 카테고리 정보 업데이트를 위한 핸들러
  const [isUpdated, setIsUpdated] = useState(false);
  const handleIsUpdated = () => {
    setIsUpdated(!isUpdated);
  };
  useEffect(() => {
    if (isUpdated) {
      getCategoryList();
      handleIsUpdated();
    }
  }, [isUpdated]);

  // 카테고리 가져오기
  const [categoryList, setCategoryList] = useState<categoryInfo[]>([]);
  const getCategoryList = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/notice/category_list`)
      .then((res) => {
        setCategoryList(res.data);
        setSelectList(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getCategoryList();
  }, []);

  // 카테고리 테이블 Column
  const columns: GridColDef[] = [
    {
      field: "category_id",
      headerName: "번호",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category_name",
      headerName: "제목",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "flag",
      headerName: "공개 여부",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  // 카테고리 테이블 Row
  const [rows, setRows] = useState<GridRowData[]>([]);
  useEffect(() => {
    let rowList: GridRowData[] = [];
    if (categoryList) {
      categoryList.map((cat) => {
        let flagValue = "공개";
        if (cat.flag === true) {
          flagValue = "비공개";
        }
        rowList.push({
          id: cat.category_id,
          ...cat,
          flag: flagValue,
        });
      });
    }
    setRows(rowList);
  }, [categoryList]);

  // 카테고리 선택 핸들러
  const [selectList, setSelectList] = useState<categoryInfo[]>([]);
  const [selectedCat, setSelectedCat] = useState<categoryInfo[]>([]);
  const handleSelect = (data: { selectionModel: GridRowId[] }) => {
    setSelectedCat(
      data.selectionModel.map((ele: any) => {
        return selectList.filter((r) => r.category_id === ele)[0];
      })
    );
  };
  useEffect(() => {
    console.log("선택한 카테고리", selectedCat);
  }, [selectedCat]);

  // 새로운 카테고리 추가 함수
  const [newCatName, setNewCatName] = useState("");
  const handleAddCategory = () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/admin/category/add_category`,
        {
          category_name: newCatName,
        },
        {
          headers: {
            Authorization: "Token " + userObj.auth_token,
          },
        }
      )
      .then((res) => {
        alert("카테고리 추가가 완료되었습니다.");
        getCategoryList();
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 카테고리 수정 함수
  const handleEditCategory = () => {
    if (selectedCat.length === 1) {
      history.push("/admin/category_admin?tabName=EDIT_CAT");
    } else {
      alert("정보 수정을 원하는 카테고리 1개를 선택해주세요.");
    }
  };

  // 수정 모달 토글러
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {tabName === "EDIT_CAT" ? (
        <CategoryForm
          userObj={userObj}
          selectedCat={selectedCat}
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
            <h2>카테고리 목록 조회</h2>
            <div>
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
              >
                새 카테고리 추가
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleEditCategory}
              >
                선택 수정
              </Button>
            </div>
          </div>
          {rows && (
            <div style={{ width: "100%", height: "100vh" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={20}
                checkboxSelection
                onSelectionModelChange={(itm: any) =>
                  handleSelect({ selectionModel: itm.selectionModel })
                }
              />
            </div>
          )}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              새 카테고리 추가
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                새로 추가하실 카테고리 이름을 입력해주세요.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="카테고리 이름"
                type="string"
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCatName(e.currentTarget.value)
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddCategory} color="primary">
                추가하기
              </Button>
              <Button autoFocus onClick={handleClose} color="primary">
                취소하기
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
