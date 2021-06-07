import { memberInfo } from 'Interface/Admin'
import { userInfo } from 'Interface/User'
import React, {useEffect,useState} from 'react'
import { DataGrid, GridColDef, GridRowData } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string'
import MailForm from './MailForm';

interface MailProps {
     userObj: userInfo,
     index: number,

     userList: memberInfo[],
     getUserList: () => void
}

export default function Mail(props: MailProps) {
     const { userObj, userList, getUserList, index } = props
     const history =useHistory()
     const location = useLocation()
     const queryObj = queryString.parse(location.search);
     const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 
     
     const [isUpdated, setIsUpdated] = useState(false)
     const handleIsUpdate = () => {
          setIsUpdated(!isUpdated)
     }
     useEffect(() => {
         if(isUpdated) {
              getUserList()
              handleIsUpdate()
         }
     }, [isUpdated])

     useEffect(() => {
          console.log(tabName, history)
          if(userList.length !== 0) {
               setSelectList(userList)
               setSelectedUser([])
          } else {
               getUserList()
          }
     }, [userList])

     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
          { field: 'username', headerName: '이름', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'email', headerName: 'Email', sortable: false, type: 'email', width: 300 ,align:'center',  headerAlign:'center'},
          { field: 'date_joined', headerName: '가입일자', width: 300, align:'center',  headerAlign:'center'},
          { field: 'num_post', headerName: '게시글 수', type: 'number', width: 150, align:'right',  headerAlign:'center'},
          { field: 'num_comment', headerName: '댓글 수', type: 'number', width: 150, align:'right',  headerAlign:'center'},
          { field: 'total_point', headerName: '누적 포인트', width: 150, align:'right',  headerAlign:'center'},
        ];

     const [selectList, setSelectList] = useState<memberInfo[]>(userList)
     const [selectedUser, setSelectedUser] = useState<memberInfo[]>([]);

     const handleSelect = (data: GridRowData) => {
          setSelectedUser(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.id === ele )[0])}
               )
          )
     }
     useEffect(() => {
          console.log('전송 하고 싶은 유저', selectedUser)
     }, [selectedUser])

     const handleNewMail = () => {
          if( selectedUser.length === 0) {
               alert('메일을 전송하려는 회원을 선택해주세요.')
          } else {
               history.push('/admin/user_admin/mail?tabName=NEW_MAIL', {
                    index: index
               })
          }
        };

     return (
          <>
               { tabName === "NEW_MAIL"
               ? <MailForm userObj={userObj} selectedUser={selectedUser} handleIsUpdate={handleIsUpdate}/>
               : 
                    <>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                         <h2>메일 전송 페이지</h2>
                         <Button color="primary" variant="contained" onClick={handleNewMail} >메일 작성</Button>    
                    </div>
                    { userList && 
                              <div style={{ height: "100vh", width: '100%'}}>
                                   <DataGrid
                                   rows={userList}
                                   columns={columns}
                                   pageSize={20}
                                   checkboxSelection
                                   onSelectionModelChange={itm => handleSelect({ selectionModel: itm.selectionModel})}
                                   />
                              </div>
                    }
                    </>
               }

               
          </>
     )
}
