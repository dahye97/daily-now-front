import { userInfo } from 'Interface/User'
import React, {useEffect,useState} from 'react'
import { useLocation } from 'react-router'
import Mail from './Mail'
import UserStatistics from './UserStatistics'
import axios from 'axios';
import { memberInfo } from 'Interface/Admin'

interface UserAdminProps {
     userObj: userInfo,
     isAdmin: boolean
}
interface locationProps {
     index: number
}

export default function UserAdmin(props: UserAdminProps) {
     const location = useLocation<locationProps>()
     const { userObj,isAdmin } = props
     const index = location.state.index // 1: 일일 회원 통계, 2: 메일 전송

     const [userList, setUserList] = useState<memberInfo[]>([])
     const getUserList = () => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/user/user_list`, {
               page_size: 10,
               search_type: null,
               search_keyword: null
          },{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res.data)
               setUserList(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })
     }

     useEffect(() => {
          if(index === 0) {
               getUserList()
          }
     }, [index])

     return (
          <div>
               {console.log(index)}
               { index === 1 
               ? <UserStatistics userObj={userObj} index={index}/>
               : index === 2
               ? <Mail userList={userList} userObj={userObj} getUserList={getUserList} index={index}/>
               : (
               
                    <>
                    <div> 사용자 관리 페이지</div>
                    { userList.length !== 0 ? userList.map( user => {
                         return ( 
                              <div key={user.id}>{user.email}</div>
                         )
                    })
                    : <div>유저 데이터 가져오는 중..</div>}

                    </>

               )
               }
          </div>
     )
}
