import { userInfo } from 'Interface/User'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AdminNav from './AdminNav';
import UserAdmin from './UserAdmin';

const useStyles = makeStyles((theme: Theme) => 
	createStyles({
          root: {
               display: 'flex',
             },
          toolbar: theme.mixins.toolbar,
          content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          },
         
	})
	);
interface AdminProps {
     userObj: userInfo,
     isAdmin: boolean,
     typeNum: string, 
     typeName: string
}

export default function Admin(props:AdminProps) {
     const classes = useStyles();
     const { userObj, isAdmin, typeNum } = props
     const checkAccess = () => {
          alert('권한이 주어진 사용자만 이용 가능합니다.')
          window.location.href="/"
     }
     return (
          <>
          { userObj && isAdmin ? 
               <>
                    <div className={classes.root}>
                         {/* 좌측 메뉴 목록 */}
                         <AdminNav userObj={userObj}/>

                         {/* 관리 컴포넌트 */}
                         <main className={classes.content}>
                              <div className={classes.toolbar} />
                              { typeNum === "01"
                                   ? <div>메인 페이지</div>
                              : typeNum === "02"
                              ? <UserAdmin isAdmin={isAdmin} userObj={userObj} />
                              : null
                              }
                         </main>
                    </div>
               </>
               : checkAccess()
          }
          </>
     )
}
