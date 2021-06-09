import React, {useState,useEffect} from 'react'
import { DataGrid, GridColDef,GridRowId } from '@material-ui/data-grid';
import { FormControl, Paper, Select,Input,MenuItem, FormLabel,FormHelperText } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent,  DialogActions,DialogContentText, TextField } from '@material-ui/core'
import axios from 'axios';
import { Button, ListItem, List,ListItemText } from '@material-ui/core';

import { memberInfo, pointCategoryInfo } from 'Interface/Admin';
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
     pointCategory: pointCategoryInfo[],
     getPointCategory: () => void
}
const useStyles = makeStyles({
     rewardForm: {
          maxWidth: '900px',
          display:'flex',
          flexDirection:'column', 
          padding: '30px', 
          marginBottom:'30px'
     },
     inputForm: {
          margin:'0 20px',
          display:'flex',
          alignItems:'baseline',
          flexDirection:'row',
     },
     inputLabel : {
          width: "100px",
          minWidth:'100px',
          marginRight:'10px'
     }
})
export default function PointReward(props:PointProps) {
     const {userObj,getPointCategory, pointCategory} = props;
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
          getPointCategory()
     }, [])
     
     useEffect(() => {
          if(pointCategory){
               console.log(pointCategory.filter( point => point.id === 99))
          }
     }, [pointCategory])
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

     useEffect(() => {
          if(pointCategory.length !== 0){
               if( type === 1){
                    setValue( (pointCategory.filter( point => point.id === 99))[0].point_value )
               }else {
                    setValue( (pointCategory.filter( point => point.id === 100))[0].point_value ) 
               }
          }
     }, [type])

     const handleSubmit = () => {
          // 적립 포인트 
          if( value !== 1 ) { // 포인트 값 변경 시
               changePoint(type)
          }else {
               addPoint()
          }
     }

     const addPoint = () => {
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
     const changePoint = (type: number) => {

          let action_id;
          if( type === 1 ){ // 지급 
               action_id = 99
          } else if(  type === 0 ) { // 차감
               action_id = 100
          }
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/point/update_point_action`, {
               "point_action_id":action_id,
               "action":null,
               "point_value": value,
               "limit_number_of_day":null
           },{
                headers: {
                     "Authorization": "Token " + userObj.auth_token,
                }
           })
           .then(res => {
                alert('포인트 변경이 완료되었습니다.')
                getPointCategory()
                addPoint()
           })
           .catch(function(error) {
                console.log(error);
           })
     }
     const initData = () => {
          setToAllMember(0)
          setType(1)
          setValue(1)
          setSelectedUser([])
     }
     const [open, setOpen] = React.useState(false);
     const handleClickOpen = () => {
          if(selectedUser.length === 0){
               alert('포인트 조정을 원하는 회원을 선택해주세요.')
          }else setOpen(true);
     };
     const handleClose = () => {
       setOpen(false);
     };

     return (
          <>
               <h2>포인트 지급 관리</h2>

               <h3>포인트 지급/차감 설정</h3>

                    <Paper className={classes.rewardForm} >
                         <FormControl className={classes.inputForm} >
                              <FormLabel className={classes.inputLabel}>적립유형</FormLabel>
                              <Select
                                   autoFocus
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
                                             disabled
                                             style={{margin: 0, marginTop: '16px'}}
                                             id="email"
                                             fullWidth
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
                              <div>
                                   <Input 
                                   value={value}
                                   id="value"
                                   onChange={(e:React.ChangeEvent<HTMLInputElement>) => 
                                        setValue(Number(e.currentTarget.value))
                                   }/>
                                   { pointCategory.length !== 0 && 
                                        <FormHelperText id="value-helper-text">
                                             <b>지급</b> 기본값은 { pointCategory && (pointCategory.filter( point => point.id === 99))[0].point_value } 포인트, 
                                             <b> 차감</b> 기본값은 { pointCategory && (pointCategory.filter( point => point.id === 100))[0].point_value } 포인트가 적용됩니다.
                                             <br />
                                             <b>차감</b> 시, <b>-</b> 부호를 함께 입력해주세요.
                                        </FormHelperText>
                                   }
                              </div>
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
                                   secondary={toAllMember === 1 ? selectedUser.map(user=> user.email + ", ") : "모든 회원"}/>
                              </ListItem>
                              <ListItem>
                                   <ListItemText 
                                   primary={ <div>적립 유형</div> } 
                                   secondary={type===0? '차감':'지급'}/>
                              </ListItem>
                              <ListItem>
                                   <ListItemText 
                                   primary={ <div>적립포인트</div> } 
                                   secondary={value + "P"}/>
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
