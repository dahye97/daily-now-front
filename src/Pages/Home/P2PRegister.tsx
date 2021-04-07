import React from 'react'
import { Collapse, Dialog ,DialogActions, DialogContent ,DialogContentText , DialogTitle,TextField, Button } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {P2PRegisterErrorInfo} from '../../Interface/Error'

interface P2PRegisterProps {
     open: boolean,
     isError: P2PRegisterErrorInfo
     handleClose: any,
     handleChange: any,
     handleSubmit: any
}
export default function P2PRegister(props: P2PRegisterProps) {
     const { handleClose, isError, handleChange, handleSubmit, open } = props;
     return (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                    <TextField onChange={handleChange} autoFocus margin="dense" id="p2pName" label="회사 이름" type="string" fullWidth/>
                    <TextField onChange={handleChange} autoFocus margin="dense" id="email" label="Email(ID)" type="email" fullWidth/>
                    <TextField onChange={handleChange} autoFocus margin="dense" id="password" label="Password" type="password" fullWidth/>
               </DialogContent>
               <DialogActions>
                    <Button type="submit" onClick={handleSubmit} color="primary">
                    등록
                    </Button>
                    <Button onClick={handleClose} color="primary">
                    취소
                    </Button>
               </DialogActions>
		</Dialog>
     )
}
