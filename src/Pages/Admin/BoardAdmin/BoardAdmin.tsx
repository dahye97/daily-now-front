import { useHistory, useLocation } from 'react-router';

import { userInfo } from 'Interface/User';
import CommentAdmin from './CommentAdmin';
import BoardStatistics from './BoardStatistics';

interface BoardAdminProps {
     userObj: userInfo,
}

interface locationProps {
     index: number
}

export default function BoardAdmin(props:BoardAdminProps) {
     
     const location = useLocation<locationProps>()
     const { userObj } = props
     const index = location.state.index // 1: 일일 회원 통계, 2: 메일 전송

     return (
          <>
           { index === 1 
               ? <CommentAdmin userObj={userObj} index={index}/>
               : index === 2
               ? <BoardStatistics 
                    userObj={userObj} 
                    index={index}
                    />
               : 
               (
                    <div style={{display:'flex'}}>
                         <h2>게시글 목록 조회</h2>
                    </div>
               )
          }
          </>
     )
}
