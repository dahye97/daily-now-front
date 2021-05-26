import React, {useState,useEffect} from 'react'
import { useHistory, } from 'react-router';

import {Button,List ,ListItem,ListItemText,Dialog ,DialogTitle
     ,DialogActions,ListItemAvatar,Avatar} from '@material-ui/core';
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

interface loginProps {
     open : boolean
}
export default function WelcomeLoginAlert(props: loginProps) {
     const history = useHistory();
     const [open, setOpen] = useState(false)
     const handleClose = () => {
          setOpen(!open)
     }
     useEffect(() => {
          if(props.open){
               handleClose()
          }
     }, [props.open])
     return (    
          <Dialog open={open} onClose={handleClose}>
               <DialogTitle>💁🏻‍♀️ 로그인이 필요한 기능입니다. </DialogTitle>
               <List>
                    <ListItem autoFocus button onClick={() => history.push('/auth')}>
                         <ListItemAvatar>
                         <Avatar>
                              <PermIdentityTwoToneIcon />
                         </Avatar>
                         </ListItemAvatar>
                         <ListItemText primary="로그인 하러가기"/>
                    </ListItem>
                    <ListItem autoFocus button onClick={() => history.push('/registration')}>
                         <ListItemAvatar>
                         <Avatar>
                              <LockTwoToneIcon />
                         </Avatar>
                         </ListItemAvatar>
                         <ListItemText primary="회원가입 하러가기" secondary="나우 회원이 되어주세요💙"/>
                    </ListItem>
               </List>
               <DialogActions>
                    <Button onClick={handleClose} color="primary">
                    돌아가기
                    </Button>
               </DialogActions>
          </Dialog>
     )
}
