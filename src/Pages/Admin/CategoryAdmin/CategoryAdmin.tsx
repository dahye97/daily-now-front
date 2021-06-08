import React,{useState,useEffect} from 'react'
import { DataGrid, GridColDef,GridRowId, GridRowData } from '@material-ui/data-grid';
import { Button } from '@material-ui/core'
import axios from 'axios';
import { categoryInfo } from 'Interface/Board';

export default function CategoryAdmin() {

     const columns: GridColDef[] = [
          { field: 'category_id', headerName: '번호', width: 150, align:'center', headerAlign:'center'},
          { field: 'category_name', headerName: '제목', width: 150 ,align:'center',  headerAlign:'center'},
        ];

     const [categoryList, setCategoryList] = useState<categoryInfo[]>([])
     const getCategoryList = () => {
          axios.get(`${process.env.REACT_APP_SERVER}/api/notice/category_list`)
               .then(res => {
                    setCategoryList(res.data)
                    setSelectList(res.data)
               })
               .catch(function(error) {
                    console.log(error);
               })  
     }

     useEffect(() => {
          getCategoryList()
     }, [])

     const [selectList, setSelectList] = useState<categoryInfo[]>([])
     const [selectedUser, setSelectedUser] = useState<categoryInfo[]>([]);
     const handleSelect = (data: { selectionModel: GridRowId[]}) => {
          setSelectedUser(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.category_id === ele)[0])}
               )
          )
     }
     useEffect(() => {
          console.log('선택한 유저', selectedUser)
     }, [selectedUser])

     const [rows, setRows] = useState<GridRowData[]>([])
     useEffect(() => {
          let rowList:GridRowData[] = [];
         if(categoryList) {
              categoryList.map(cat => {
                   rowList.push(
                        {
                         id: cat.category_id,
                         ...cat
                        }
                   )
              })
         }
         setRows(rowList)
     }, [categoryList])

     useEffect(() => {
         console.log('rows', rows)
     }, [rows])
     return (
          <>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>카테고리 목록 조회</h2>
                    <div>
                         <Button color="primary" variant="contained" >새 카테고리 추가</Button>    
                         <Button color="primary" variant="contained" >선택 수정</Button>    
                    </div>
               </div>
               { rows && 
                    <div style={{ width: '100%', height:'100vh'}}>
                    <DataGrid
                         rows={rows}
                         columns={columns}
                         pageSize={20}
                         checkboxSelection
                         onSelectionModelChange={(itm:any) => handleSelect({ selectionModel: itm.selectionModel})}
                    />
                    </div>
               }
          </>
     )
}
