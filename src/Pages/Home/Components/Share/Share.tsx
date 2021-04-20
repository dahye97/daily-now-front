import React , {useState} from 'react'
import { IconButton,BottomNavigation,BottomNavigationAction  } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import InstagramIcon from '@material-ui/icons/Instagram';

import axios from 'axios'
import { useHistory } from 'react-router';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { userInfo } from '../../../../Interface/User';

const useStyles = makeStyles({
     root: {
       background: 'none',
       border: 'none',
       padding: "10px"
     },
   });

interface ShareProps {
	userObj : userInfo | null,
}
export default function Share(props: ShareProps) {
     const classes = useStyles();

     const {userObj} = props;
     const history = useHistory()
     const [shareUrl, setShareUrl] = useState('')

     const [value, setValue] = React.useState(0);

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
                    
                    // setShareUrl(`/registration?share=TRUE&ucode=${res.data}`) // 보내야 하는 url 
                    // todo: sns 연동  
                    // todo: 친구 초대 포인트 적립 api 보내기 
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }
     return (
          <div>
               <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                    setValue(newValue);
                    }}
                    showLabels
                    className={classes.root}
                    >
                    <BottomNavigationAction label="인스타그램" icon={<InstagramIcon />} onClick={handleClickInvite} />
                    <BottomNavigationAction label="찜한 상품" icon={<FavoriteIcon />} />
               </BottomNavigation>
          </div>
     )
}
