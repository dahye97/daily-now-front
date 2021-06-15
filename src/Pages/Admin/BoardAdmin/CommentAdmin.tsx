import React from 'react'
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { Button,IconButton } from '@material-ui/core'
import { userInfo } from 'Interface/User';

interface CommentAdminProps {
     userObj: userInfo,
     index: number,
}

export default function CommentAdmin(props:CommentAdminProps) {
     return (
          <div style={{display:'flex'}}>
               <h2>댓글 목록 조회</h2>
          </div>
     )
}
