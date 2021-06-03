import { userInfo } from 'Interface/User'
import React from 'react'
import { useLocation } from 'react-router'
import Mail from './Mail'
import UserStatistics from './UserStatistics'

interface UserAdminProps {
     userObj: userInfo | null,
     isAdmin: boolean
}
interface locationProps {
     index: number
}

export default function UserAdmin(props: UserAdminProps) {
     const location = useLocation<locationProps>()
     const index = location.state.index
     return (
          <div>
               {console.log(index)}
               { index === 1 
               ? <UserStatistics />
               : index === 2
               ? <Mail />
               : <div> 사용자 관리 페이지</div>
               }
          </div>
     )
}
