import React, {useState} from 'react'
import { Paper,IconButton, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle, Button } from "@material-ui/core";
import { p2pInfo, userInfo } from 'Interface/User';
import { makeStyles, } from "@material-ui/styles";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios'

const useStyles = makeStyles ({
     p2pItem: {
          margin:'5px 0',
          padding: '5px',
          background: '#e3f2fd',
          borderRadius: '20px',
          height: '100px',

          display: 'flex', 
          justifyContent: 'space-evenly',
          alignItems: 'center',
          '&:hover': {
               background: '#bbdefb',
               transition: "all ease 0.5s 0s",

               '& $managementButton': {
                    display: 'block'
               }
          }
     },    
     infoItem: {
          color: '#616161',
          
          '& span' : {
               padding: '10px'
          }
     },
     managementButton: {
          display: 'none'
     }
})
interface AccountItemProps {
     accountInfo: p2pInfo
     userObj : userInfo | null,
     handleP2PUpdated : () => void, // 회사 추가 여부 
     handleClickOpen: (accountInfo: p2pInfo) => void
}
export default function AccountItem(props: AccountItemProps) {
     const classes = useStyles()
     const { accountInfo, userObj, handleP2PUpdated, handleClickOpen } = props
 
     const [isDeleteAccount, setIsDeleteAccount] = useState(false)

     const handleClickEdit = () => {
          handleClickOpen(accountInfo)
     }
     const handleDelete = () => {
          if( userObj !== null ) {
               axios.post(`${process.env.REACT_APP_SERVER}/api/register/company_delete`, {
                    company_id : accountInfo.company_id
               },{
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               }).then(res => {
                    alert('계정 삭제가 완료되었습니다.')
                    handleP2PUpdated()
               })
               .catch(function(error) {
                   console.log(error)
               })
          }
     }
 
 
     return (
          <Paper className={classes.p2pItem}>
               <div className={classes.infoItem}>
                   <span>{accountInfo.company_name}</span>
                    <span>{accountInfo.email}</span>
               </div>
               <div className={classes.managementButton}>
                    <IconButton onClick={handleClickEdit}><EditIcon /></IconButton>
                    <IconButton onClick={() => setIsDeleteAccount(true)}><DeleteForeverIcon /></IconButton>
               </div>
               <Dialog
                    open={isDeleteAccount}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogTitle id="alert-dialog-title">{accountInfo.company_name} 계정 해지</DialogTitle>
                    <DialogContent>
                         <DialogContentText id="alert-dialog-description">
                         정말 해지하시는 건가요? 해지 시, 포인트가 차감됩니다 😥
                         </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                         <Button color="secondary" id="withDrawButton" onClick={handleDelete}>
                         해지하기
                         </Button>
                         <Button onClick={() => setIsDeleteAccount(false)} autoFocus>
                         돌아가기
                         </Button>
                    </DialogActions>
               </Dialog>
          </Paper>
     )
}
