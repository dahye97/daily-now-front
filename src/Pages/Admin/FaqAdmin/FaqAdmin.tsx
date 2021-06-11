import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { faqInfo } from 'Interface/FAQ';
import { Button, Dialog, DialogTitle, DialogContent,  DialogActions,DialogContentText, TextField,Paper
, ListItem, List,ListItemText } from '@material-ui/core'
import { DataGrid, GridColDef,GridRowId, GridRowData } from '@material-ui/data-grid';
import { userInfo } from 'Interface/User';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string'
import FaqForm from './FaqForm';

interface FaqAdminProps {
     userObj: userInfo,
}

export default function FaqAdmin(props:FaqAdminProps) {
     const {userObj} = props
     const [faqList, setFaqList] = useState<faqInfo[]>([])
     const history = useHistory()
     
     const location = useLocation()
     const queryObj = queryString.parse(location.search);
     const tabName = queryObj.tabName; // url에서 현재 tap name 받아오기 

     const columns: GridColDef[] = [
          { field: 'id', headerName: '번호', width: 150, align:'center', headerAlign:'center'},
          { field: 'order', headerName: '순서', width: 150 ,align:'center',  headerAlign:'center'},
          { field: 'question', headerName: '질문', width: 500 ,align:'center',  headerAlign:'center'},
          { field: 'answer', headerName: '답변', width: 600 ,align:'center',  headerAlign:'center'},
          { field: 'view', headerName: '조회 수', width: 150 ,align:'center',  headerAlign:'center'},
        ];

          // FAQ 정보 업데이트를 위한 핸들러
       const [isUpdated, setIsUpdated] = useState(false)
       const handleIsUpdated = () => {
            setIsUpdated(!isUpdated)
       }
  
       useEffect(() => {
            if(isUpdated) {
               getFAQData()
               handleIsUpdated()
            }
       }, [isUpdated])

     const getFAQData = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/notice/faq_list`, {
               page_size: 10
          }).then(res => {
               setFaqList(res.data.results)
               setSelectList(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })  
     }
     useEffect(() => {
          getFAQData()
     }, [])

     const [selectList, setSelectList] = useState<faqInfo[]>([])
     const [selectedFaq, setSelectedFaq] = useState<faqInfo[]>([]);
     const handleSelect = (data: { selectionModel: GridRowId[]}) => {
          setSelectedFaq(
               data.selectionModel.map( (ele:any) => {
                    return (selectList.filter((r)=>  r.id === ele)[0])}
               )
          )
     }
     useEffect(() => {
          console.log('선택한 faq', selectedFaq)
     }, [selectedFaq])

     const [question, setQuestion] = useState("")
     const [answer, setAnswer] = useState("")
     const handleAddFaq = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/faq/add_faq`,{
               "question":question,
               "answer":answer
          },
          {
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               alert('FAQ 추가가 완료되었습니다.')
               getFAQData()
               onCloseEdit()
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     const handleEditFaq = () => {
          if( selectedFaq.length === 1) {
               history.push('/admin/faq_admin?tabName=EDIT_FAQ')

          }else {
               alert('정보 수정을 원하는 카테고리 1개를 선택해주세요.')
          }
     }

     const handleDeleteFaq = () => {
          let faqlist = selectedFaq.map( faq => faq.id)
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/faq/delete_faq`, {
               faq_id: faqlist
           },{
                headers: {
                     "Authorization": "Token " + userObj.auth_token,
                }
           })
           .then(res => {
                alert('FAQ 삭제 처리 되었습니다.')
                onCloseDelete()
                getFAQData()
           })
           .catch(function(error) {
                console.log(error);
           })
     }

     const [openEdit, setOpenEdit] = React.useState(false);
     const onOpenEdit = () => {
       setOpenEdit(true);
     };
     const onCloseEdit = () => {
       setOpenEdit(false);
     };

     const [openDelete, setOpenDelete] = React.useState(false);
     const onOpenDelete = () => {
       setOpenDelete(true);
     };
     const onCloseDelete = () => {
       setOpenDelete(false);
     };
     return (
          <>
          { tabName === "EDIT_FAQ" 
          ?
               <FaqForm userObj={userObj} selectedFaq={selectedFaq} faqCount={faqList.length} handleIsUpdated={handleIsUpdated}/>
          :
          <>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>FAQ 목록 조회</h2>
                    <div>
                         <Button color="primary" variant="contained" onClick={onOpenEdit}>새 FAQ 추가</Button>    
                         <Button color="primary" variant="contained" onClick={handleEditFaq} >선택 수정</Button>    
                         <Button color="primary" variant="contained" onClick={onOpenDelete} >선택 삭제</Button>    
                    </div>
               </div>       
               
               { faqList && 
                    <div style={{ width: '100%', height:'100vh'}}>
                    <DataGrid
                         rows={faqList}
                         columns={columns}
                         pageSize={20}
                         checkboxSelection
                         onSelectionModelChange={(itm:any) => handleSelect({ selectionModel: itm.selectionModel})}
                    />
                    </div>
               }

                    <Dialog
                         open={openEdit}
                         onClose={onCloseEdit}
                         aria-labelledby="draggable-dialog-title"
                         >
                         <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                              새 FAQ 추가
                         </DialogTitle>
                         <DialogContent>
                              <DialogContentText>
                              새로 추가하실 FAQ, 질문 및 답변을 입력해주세요.
                              </DialogContentText>
                              <TextField
                              autoFocus
                              margin="dense"
                              id="question"
                              label="질문"
                              type="string"
                              fullWidth
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setQuestion(e.currentTarget.value)}
                              />
                              <TextField
                              margin="dense"
                              id="answer"
                              label="답변"
                              type="string"
                              fullWidth
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAnswer(e.currentTarget.value)}
                              />
                         </DialogContent>
                         <DialogActions>
                              <Button color="primary" onClick={handleAddFaq}>
                              추가하기
                              </Button>
                              <Button onClick={onCloseEdit} color="primary">
                              취소하기
                              </Button>
                         </DialogActions>
                    </Dialog>
              
                    <Dialog
                         open={openDelete}
                         onClose={onCloseDelete}
                         aria-labelledby="draggable-dialog-title"
                         >
                         <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                              FAQ 삭제
                         </DialogTitle>
                         <DialogContent>

                              <Paper>
                                   <List>
                                        {
                                             selectedFaq.map( faq => {
                                                  return(
                                                       <ListItem>
                                                            <ListItemText 
                                                            primary={ 
                                                            <div>ID : {faq.id} <br/>
                                                            Q. : {faq.question}<br />
                                                            A. : {faq.answer}</div> 
                                                            } />
                                                       </ListItem>
                                                  )
                                             })
                                        }
                                   </List>
                              </Paper>
                              
                              <DialogContentText>
                              선택하신 위 {selectedFaq.length}개의 FAQ 가 삭제됩니다. 
                              </DialogContentText>
                         </DialogContent>
                         <DialogActions>
                              <Button color="primary" onClick={handleDeleteFaq}>
                              삭제하기
                              </Button>
                              <Button onClick={onCloseDelete} color="primary">
                              취소하기
                              </Button>
                         </DialogActions>
                    </Dialog>
               </>
               }
          </>
     )
}
