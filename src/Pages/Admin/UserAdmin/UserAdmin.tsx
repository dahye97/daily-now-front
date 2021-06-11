import { userInfo } from 'Interface/User'
import React, {useEffect,useState} from 'react'
import { useHistory, useLocation } from 'react-router'
import Mail from './Mail'
import UserStatistics from './UserStatistics'
import axios from 'axios';
import { memberInfo } from 'Interface/Admin'
import { DataGrid, GridColDef,GridRowId } from '@material-ui/data-grid';
import { Button } from '@material-ui/core'
import queryString from 'query-string'
import UserForm from './UserForm'
import UserDelete from './UserDelete'

interface UserAdminProps {
     userObj: userInfo,
}
interface locationProps {
     index: number
}

export default function UserAdmin(props: UserAdminProps) {
     const location = useLocation<locationProps>()
     const { userObj } = props
     const index = location.state.index // 1: 일일 회원 통계, 2: 메일 전송
     const history =useHistory()

     const queryObj = queryString.parse(location.search);
     const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

     // 회원 정보 업데이트를 위한 핸들러
     const [isUpdated, setIsUpdated] = useState(false)
     const handleIsUpdated = () => {
          setIsUpdated(!isUpdated)
     }

     useEffect(() => {
          if(isUpdated) {
               getUserList()
               handleIsUpdated()
          }
     }, [isUpdated])
     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
          { field: 'username', headerName: '이름', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'email', headerName: 'Email', sortable: false, type: 'email', width: 300 ,align:'center',  headerAlign:'center'},
          { field: 'date_joined', headerName: '가입일자', width: 300, align:'center',  headerAlign:'center'},
          { field: 'num_post', headerName: '게시글 수', type: 'number', width: 150, align:'right',  headerAlign:'center'},
          { field: 'num_comment', headerName: '댓글 수', type: 'number', width: 150, align:'right',  headerAlign:'center'},
          { field: 'total_point', headerName: '누적 포인트', width: 150, align:'right',  headerAlign:'center'},
        ];

     const [userList, setUserList] = useState<memberInfo[]>([])
     const getUserList = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/user/user_list`, {
               page_size: 20,
               search_type: null,
               search_keyword: null
          },{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               // console.log(res.data.results)
               setUserList(res.data.results)
               setSelectList(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     useEffect(() => {
          if(index === 0) {
               getUserList()
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

     const handleUserToDelete = () => {
          history.push('/admin/user_admin?tabName=DELETE_USER',{
               index: index
          })
     }

     const handleUserToEdit = () => {
          if( selectedUser.length === 1) {
               history.push('/admin/user_admin?tabName=EDIT_USER',{
                    index: index
               })
          }else {
               alert('정보 수정을 원하는 사용자 1명을 선택해주세요.')
          }
     }

     return (
          <div>
               {/* {console.log(index)} */}
               { index === 1 
               ? <UserStatistics userObj={userObj} index={index}/>
               : index === 2
               ? <Mail userList={userList} userObj={userObj} getUserList={getUserList} index={index}/>
               : (
                    tabName === "EDIT_USER" 
                    ?
                         <UserForm userObj={userObj} selectedUser={selectedUser} handleIsUpdated={handleIsUpdated}/>
                    : tabName === "DELETE_USER"
                    ?
                         <UserDelete userObj={userObj} selectedUser={selectedUser} handleIsUpdated={handleIsUpdated}/>
                    :
                         <>
                              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                   <h2>회원 목록 조회</h2>
                                   <div>
                                        <Button color="primary" variant="contained" onClick={handleUserToEdit} >선택 회원 수정</Button>    
                                        <Button color="primary" variant="contained" onClick={handleUserToDelete} >선택 회원 삭제</Button>    
                                   </div>
                              </div>
                              { userList && 
                                   <div style={{ width: '100%', height:'100vh'}}>
                                   <DataGrid
                                        rows={userList}
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
          </div>
     )
}
