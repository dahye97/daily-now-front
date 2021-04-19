import React , {useState} from 'react'
import { IconButton } from '@material-ui/core'
import InstagramIcon from '@material-ui/icons/Instagram';
import { userInfo } from '../../Interface/User';
import axios from 'axios'
import { useHistory } from 'react-router';

interface ShareProps {
	userObj : userInfo | null,
}
export default function Share(props: ShareProps) {
     const {userObj} = props;
     const history = useHistory()
     const [shareUrl, setShareUrl] = useState('')
     const handleClickInvite = () => {
          if( userObj !== null) {
               axios.get(`http://192.168.0.69:8000/api/join/create_code`, 
               {
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               })
               .then(res => {
                    console.log(res.data)// 유저 초대 코드 
                    history.push(`/registration?share=TRUE&ucode=${res.data}`) // 회원가입 페이지로 코드 전송
                    setShareUrl(`/registration?share=TRUE&ucode=${res.data}`) // 보내야 하는 url 
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }
     return (
          <div>
              <IconButton onClick={handleClickInvite}><InstagramIcon /></IconButton>
          </div>
     )
}
