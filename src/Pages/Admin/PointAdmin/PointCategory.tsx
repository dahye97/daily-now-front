import React,{useState,useEffect} from 'react'
import { DataGrid, GridColDef,GridRowId, GridRowData } from '@material-ui/data-grid';
import { Button, Dialog, DialogTitle, DialogContent,  DialogActions,DialogContentText, TextField } from '@material-ui/core'
import axios from 'axios';
import { categoryInfo } from 'Interface/Board';
import { userInfo } from 'Interface/User';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string'
import { pointCategoryInfo } from 'Interface/Admin';

interface CatAdminProps {
     userObj: userInfo,
     pointCategory: pointCategoryInfo[],
     getPointCategory: () => void,
}

export default function PointCategory(props:CatAdminProps) {
     const { userObj,getPointCategory, pointCategory } = props;
     const history= useHistory()

     const location = useLocation()
     const queryObj = queryString.parse(location.search);
     const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

       // 카테고리 정보 업데이트를 위한 핸들러
       const [isUpdated, setIsUpdated] = useState(false)
       const handleIsUpdated = () => {
            setIsUpdated(!isUpdated)
       }
  
       useEffect(() => {
            if(isUpdated) {
               handleIsUpdated()
            }
       }, [isUpdated])

     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
          { field: 'action', headerName: '내용', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'point_value', headerName: '지급 포인트', type: 'number', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'limit_number_of_day', headerName: '지급 제한 수', width: 150 ,align:'center',  headerAlign:'center'},
        ];

     useEffect(() => {
          getPointCategory()
     }, [])

     const [selectList, setSelectList] = useState<categoryInfo[]>([])
     const [selectedCat, setSelectedCat] = useState<categoryInfo[]>([]);
     const handleSelect = (data: { selectionModel: GridRowId[]}) => {
          setSelectedCat(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.category_id === ele)[0])}
               )
          )
     }
     useEffect(() => {
          console.log('선택한 포인트 종류', selectedCat)
     }, [selectedCat])

     const [rows, setRows] = useState<GridRowData[]>([])


     const [newCatName, setNewCatName] = useState("")
     const handleAddCategory = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/category/add_category`,{
               category_name: newCatName
          },
          {
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               alert('카테고리 추가가 완료되었습니다.')
               handleClose()
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     const handleEditCategory = () => {
          if( selectedCat.length === 1) {
               history.push('/admin/point_admin/category?tabName=EDIT_POINT')
          }else {
               alert('정보 수정을 원하는 포인트 1개를 선택해주세요.')
          }
     }

     const handleDeletePoint = () => {

     }
     const [open, setOpen] = useState(false);
     const handleClickOpen = () => {
       setOpen(true);
     };
     const handleClose = () => {
       setOpen(false);
     };
     return (
          <>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>포인트 종류 관리</h2>
                    <div>
                         <Button color="primary" variant="contained" onClick={handleClickOpen}>새 포인트 추가</Button>    
                         <Button color="primary" variant="contained" onClick={handleEditCategory} >선택 수정</Button>    
                         <Button color="primary" variant="contained" onClick={handleDeletePoint} >선택 삭제</Button>    
                    </div>
                    
               </div>       
               { rows && 
                    <div style={{ width: '100%', height:'100vh'}}>
                    <DataGrid
                         rows={pointCategory}
                         columns={columns}
                         pageSize={20}
                         checkboxSelection
                         onSelectionModelChange={(itm:any) => handleSelect({ selectionModel: itm.selectionModel})}
                    />
                    </div>
               }

               <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="draggable-dialog-title"
                    >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
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
                         onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewCatName(e.currentTarget.value)}
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
     )
}

