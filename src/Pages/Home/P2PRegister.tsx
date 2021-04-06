import React from 'react'
import { Collapse, IconButton, Avatar,Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {P2PRegisterErrorInfo} from '../../Interface/Error'

interface P2PRegisterProps {
     open: boolean,
     isError: P2PRegisterErrorInfo
     onClose: any,
     onChange: any,
     onSubmit: any
}
export default function P2PRegister(props: P2PRegisterProps) {
     const { onClose, isError, onChange, onSubmit, open } = props;
     return (
          <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">P2P 회사 등록</DialogTitle>
               <Collapse in={isError.isTrue}>
                    <Alert  
                         severity={ isError.isTrue ? "error":"success"}>
                         <AlertTitle>등록 { isError.isTrue ? "실패" : "성공"}</AlertTitle>
                         <strong>{isError.message}</strong>
                    </Alert>
               </Collapse>
               <DialogContent>
                    <DialogContentText>
                    연동할 회사의 이름과 회원 ID, 패스워드를 입력해주세요.
                    </DialogContentText>
                    <TextField onChange={onChange} autoFocus margin="dense" id="p2pName" label="회사 이름" type="string" fullWidth/>
                    <TextField onChange={onChange} autoFocus margin="dense" id="email" label="Email(ID)" type="email" fullWidth/>
                    <TextField onChange={onChange} autoFocus margin="dense" id="password" label="Password" type="password" fullWidth/>
               </DialogContent>
               <DialogActions>
                    <Button type="submit" onClick={onSubmit} color="primary">
                    등록
                    </Button>
                    <Button onClick={onClose} color="primary">
                    취소
                    </Button>
               </DialogActions>
		</Dialog>
     )
}
