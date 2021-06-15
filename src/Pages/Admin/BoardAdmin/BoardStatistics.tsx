import React from 'react'
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { Button,IconButton } from '@material-ui/core'
import { userInfo } from 'Interface/User';

interface BoardStatisticsProps {
     userObj: userInfo,
     index: number,
}

export default function BoardStatistics(props:BoardStatisticsProps) {
     return (
          <div style={{display:'flex'}}>
               <h2>게시판 통계</h2>
          </div>
     )
}
