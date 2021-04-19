import React from 'react'
import { IconButton } from '@material-ui/core'
import InstagramIcon from '@material-ui/icons/Instagram';
import { userInfo } from '../../Interface/User';
import axios from 'axios'

interface ShareProps {
	userObj : userInfo | null,
}
export default function Share(props: ShareProps) {
     const {userObj} = props;
     const handleClickInvite = () => {
          if( userObj !== null) {
               axios.get(`http://192.168.0.69:8000/api/join/create_code`, 
               {
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               })
               .then(res => {
                    console.log(res.data) // 유저 초대 코드 
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
