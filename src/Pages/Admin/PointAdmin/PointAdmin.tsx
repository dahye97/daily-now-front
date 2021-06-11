import { userInfo } from 'Interface/User'
import {useEffect,useState} from 'react'
import { useHistory, useLocation } from 'react-router'

import axios from 'axios';
import { memberInfo, pointAdmin } from 'Interface/Admin'
import { DataGrid, GridColDef,GridRowId } from '@material-ui/data-grid';
import queryString from 'query-string'
import PointCategory from './PointCategory';
import PointReward from './PointReward';
import { createDate } from 'Pages/Home/Profile/Point/Point';
import { pointCategoryInfo } from 'Interface/Admin';


interface UserAdminProps {
     userObj: userInfo,
}
interface locationProps {
     index: number
}

export default function PointAdmin(props: UserAdminProps) {
     const location = useLocation<locationProps>()
     const { userObj } = props
     const index = location.state.index // 1: 포인트 종류 , 2: 포인트 등록
     const history =useHistory()

     const queryObj = queryString.parse(location.search);
     const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

     // 포인트 정보 업데이트를 위한 핸들러
     const [isUpdated, setIsUpdated] = useState(false)
     const handleIsUpdated = () => {
          setIsUpdated(!isUpdated)
     }

     useEffect(() => {
          if(isUpdated) {
               getPointList()
               handleIsUpdated()
          }
     }, [isUpdated])
     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
          { field: 'email', headerName: 'Email', sortable: false, type: 'email', width: 300 ,align:'center',  headerAlign:'center'},
          { field: 'date', headerName: '날짜', sortable: false, type: 'date', width: 300 ,align:'center',  headerAlign:'center'},
          { field: 'action', headerName: '내용', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'detail_action', headerName: '상세 내용', width: 300, align:'center',  headerAlign:'center'},
          { field: 'point', headerName: '포인트', type: 'number', width: 150, align:'right',  headerAlign:'center'},
          { field: 'total_point', headerName: '누적 포인트', type: 'number', width: 150, align:'right',  headerAlign:'center'},
        ];

     const [startDate, handleStartDate] = useState<Date | null>(new Date());
     const [endDate, handleEndDate] = useState<Date | null>(new Date());
     let firstData = createDate(new Date());
     let secondData = createDate(new Date());

     const [pointList, setPointList] = useState<pointAdmin[]>([])
     const getPointList = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/point/point_list`, {
               page_size: 20,
               start:"2021-06-09",
               end: "2021-06-09",
               email:null
          },{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res.data.results)
               setPointList(res.data.results)
               setSelectList(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     useEffect(() => {
          if(index === 0) {
               getPointList()
          }
     }, [index])
     
     const [selectList, setSelectList] = useState<memberInfo[]>([])
     const [selectedUser, setSelectedUser] = useState<memberInfo[]>([]);
     const handleSelect = (data: { selectionModel: GridRowId[]}) => {
          setSelectedUser(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.id === ele )[0])}
               )
          )
     }

     useEffect(() => {
          console.log('선택한 유저', selectedUser)
     }, [selectedUser])

     const [pointCategory, setPointCategory] = useState<pointCategoryInfo[]>([])
     const getPointCategory = () =>{
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/point/point_action_list`, {
               page_size: 20,
          },{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res.data.results)
               setPointCategory(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     return (
          <>
          {index === 1
               ? <PointCategory userObj={userObj} pointCategory={pointCategory} getPointCategory={getPointCategory}/>
          : index === 2
               ? <PointReward userObj={userObj}  pointCategory={pointCategory} getPointCategory={getPointCategory} />
          :
          <>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>포인트 목록 조회</h2>
               </div>
               { pointList && 
                    <div style={{ width: '100%', height:'100vh'}}>
                    <DataGrid
                         rows={pointList}
                         columns={columns}
                         pageSize={20}
                         checkboxSelection
                         onSelectionModelChange={(itm:any) => handleSelect({ selectionModel: itm.selectionModel})}
                    />
                    </div>
               }
          </>
          }
               </>
     )

}