import { userInfo } from 'Interface/User'
import {useEffect,useState} from 'react'
import { useHistory, useLocation } from 'react-router'

import axios from 'axios';
import queryString from 'query-string'

import { DataGrid, GridColDef,GridRowId } from '@material-ui/data-grid';

import { companyInfo } from 'Interface/Admin'
import { pointCategoryInfo } from 'Interface/Admin';
import { createDate } from 'Pages/Home/Profile/Point/Point';


interface P2PAdminProps {
     userObj: userInfo,
}
interface locationProps {
     index: number
}

export default function P2PAdmin(props: P2PAdminProps) {
     const location = useLocation<locationProps>()
 
     // 정보 업데이트를 위한 핸들러
     const [isUpdated, setIsUpdated] = useState(false)
     const handleIsUpdated = () => {
          setIsUpdated(!isUpdated)
     }

     useEffect(() => {
          if(isUpdated) {
               getP2PList()
               handleIsUpdated()
          }
     }, [isUpdated])

     // 회사 테이블 columns
     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
          { field: 'company_name', headerName: '회사명', sortable: false, type: 'string', width: 300 ,align:'center',  headerAlign:'center'},
          { field: 'nickname', headerName: '닉네임', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'homepage_url', headerName: 'URL', sortable: false, type: 'string', width: 700 ,align:'center',  headerAlign:'center'},
          ];

     // 회사 정보 불러오기
     const [p2pList, setP2PList] = useState<companyInfo[]>([])
     const getP2PList = () => {
          axios.get(`${process.env.REACT_APP_SERVER}/api/register/company`)
          .then(res => {
               console.log(res.data)
               setP2PList(res.data)
               setSelectList(res.data)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     
     // 선택 p2p 처리 함수
     const [selectList, setSelectList] = useState<companyInfo[]>([])
     const [selectedUser, setSelectedUser] = useState<companyInfo[]>([]);
     const handleSelect = (data: { selectionModel: GridRowId[]}) => {
          setSelectedUser(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.id === ele )[0])}
               )
          )
     }

     useEffect(() => {
          console.log('선택한 회사', selectedUser)
     }, [selectedUser])

     useEffect(() => {
          getP2PList()
     }, [])

     return (
          <>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>P2P 목록 조회</h2>
               </div>
               { p2pList && 
                    <div style={{ width: '100%', height:'100vh'}}>
                    <DataGrid
                         rows={p2pList}
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