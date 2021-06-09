import React, {useState,useEffect} from 'react'
import { DataGrid, GridColDef,GridRowId } from '@material-ui/data-grid';
import { FormControl, Paper, Select,Input,MenuItem, FormLabel,FormHelperText } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent,  DialogActions,DialogContentText, TextField } from '@material-ui/core'
import axios from 'axios';
import { Button, ListItem, List,ListItemText } from '@material-ui/core';

import { memberInfo } from 'Interface/Admin';
import { userInfo } from 'Interface/User';
import { makeStyles } from "@material-ui/core/styles";

const columns: GridColDef[] = [
     { field: 'id', headerName: 'ID', width: 150, align:'center', headerAlign:'center'},
     { field: 'username', headerName: '이름', width: 150 ,align:'center',  headerAlign:'center'},
     { field: 'email', headerName: 'Email', sortable: false, type: 'email', width: 300 ,align:'center',  headerAlign:'center'},
     { field: 'date_joined', headerName: '가입일자', width: 300, align:'center',  headerAlign:'center'},
     { field: 'total_point', headerName: '누적 포인트', width: 150, align:'right',  headerAlign:'center'},
   ];
   
interface PointProps {
     userObj: userInfo,
}
const useStyles = makeStyles({
     rewardForm: {
          maxWidth: '900px'
     },
     inputForm: {
          margin:'0 20px',
          display:'flex',
          alignItems:'baseline',
          flexDirection:'row',
     },
     inputLabel : {
          width: "100px",
          minWidth:'100px'
     }
})
export default function PointReward(props:PointProps) {
     const {userObj} = props;
     const [userList, setUserList] = useState<memberInfo[]>([])
     const classes = useStyles()
     
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
          getUserList()
     }, [])
     
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
          if( selectedUser.length === selectList.length){
               setToAllMember(0)
          }else {
               setToAllMember(1)
          }
     }, [selectedUser])

     const [toAllMember, setToAllMember] = useState(0) // 0 : 모든 회원, 1: 특정 회원
     const [type, setType] = useState(1) // 적립 유형 , 1: 지급, 0: 차감
     const [value, setValue] = useState(0) // 적립 금액 

     const handleSubmit = () => {
          
          let urlQuery;
          // 포인트 유형 
          if( type === 1) urlQuery = "add_point" // 1 : 지급
          else urlQuery = "lose_point" // 0 : 차감

          let emailList: null | string[] = null

          // 조정 대상 
          if( toAllMember ) { // all 
               emailList = null
          } else { // 특정 회원
               emailList = selectedUser.map( (user) => user.email )
          }

          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/point/${urlQuery}`, {
              all : toAllMember,
              email : emailList 
          },{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               alert('포인트 등록이 완료되었습니다.')
               handleClose()
               initData()
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     const initData = () => {
          setToAllMember(0)
          setType(1)
          setValue(0)
          setSelectedUser([])
     }
     const [open, setOpen] = React.useState(false);
     const handleClickOpen = () => {
       setOpen(true);
     };
     const handleClose = () => {
       setOpen(false);
     };

     return (
          <>
               <h2>포인트 지급 관리</h2>

               <h3>포인트 지급/차감 설정</h3>

                    <Paper className={classes.rewardForm} style={{display:'flex',flexDirection:'column', padding: '20px', marginBottom:'30px'}}>
                         <FormControl className={classes.inputForm} >
                              <FormLabel className={classes.inputLabel}>적립유형</FormLabel>
                              <Select
                                   id="type"
                                   value={type}
                                   onChange={(event: React.ChangeEvent<{ value: unknown }>) => 
                                   {
                                        setType(event.target.value as number)
                                   }
                                   }
                              >
                                   <MenuItem value={1}>지급</MenuItem>
                                   <MenuItem value={0}>차감</MenuItem>
                              </Select>
                         </FormControl>
                         <FormControl className={classes.inputForm}>
                                   <FormLabel className={classes.inputLabel}>조정 대상</FormLabel>
                                   <div>
                                        <Input 
                                             style={{margin: 0, marginTop: '16px'}}
                                             id="email"
                                             fullWidth
                                             autoFocus
                                             multiline
                                             rowsMax="10"
                                             placeholder="회원 이메일"
                                             value={selectedUser.map( user => user.email)} 
                                             />
                                        <FormHelperText id="email-helper-text">
                                             아래 회원 목록에서 회원 선택 시 자동으로 이메일이 입력됩니다.
                                        </FormHelperText>
                                   </div>
                         </FormControl>
                         <FormControl className={classes.inputForm} >
                              <FormLabel className={classes.inputLabel}>적립포인트</FormLabel>
                              <Input 
                              placeholder="적립 포인트 입력"
                              id="value"
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => 
                                   setValue(Number(e.currentTarget.value))
                              }/>
                         </FormControl>

                         <div style={{display:'block', textAlign:'right'}}>
                              <Button variant="contained" color="primary" onClick={handleClickOpen}>등록</Button>
                         </div>

               </Paper>

               <h3>회원 목록</h3>
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

               <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="draggable-dialog-title"
                    >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                         포인트 등록
                    </DialogTitle>
                    <DialogContent>
                         <List>
                              <ListItem>
                                   <ListItemText 
                                   primary={ <div>조정 대상</div> } 
                                   secondary={type === 1? selectedUser.map(user=> user.email + ", ") : "모든 회원"}/>
                              </ListItem>
                              <ListItem>
                                   <ListItemText 
                                   primary={ <div>적립 유형</div> } 
                                   secondary={type===0? '차감':'지급'}/>
                              </ListItem>
                              <ListItem>
                                   <ListItemText 
                                   primary={ <div>적립포인트</div> } 
                                   secondary={value}/>
                              </ListItem>
                         </List>
                         <DialogContentText>
                         위 정보의 포인트를 등록합니다. 
                         </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleSubmit} color="primary">
                         저장하기
                         </Button>
                         <Button autoFocus onClick={handleClose} color="primary">
                         취소하기
                         </Button>
                    </DialogActions>
               </Dialog>
          </>
     )
}
