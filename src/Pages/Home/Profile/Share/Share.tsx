import React , {useState,useEffect} from 'react'
import { useHistory, useLocation } from 'react-router';
import axios from 'axios'

import { BottomNavigation,BottomNavigationAction,Card,CardHeader } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { userInfo } from 'Interface/User';

const useStyles = makeStyles({
     root: {
       background: 'none',
       border: 'none',
       padding: "10px",
     },
     shareCard : {
          margin: '20px 0',
          borderRadius: '20px'
     },
     kakaoButton: {
          paddingRight: '12px',
          background: "url('//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
     }
   });

interface ShareProps {
	userObj : userInfo | null,
     myPoint: number,
     updatePoint : () => void
}
export default function Share(props: ShareProps) {
     const classes = useStyles();
     const location = useLocation()
     const {userObj,myPoint,updatePoint} = props;
     const history = useHistory()
     const [shareUrl, setShareUrl] = useState('')

     const [value, setValue] = React.useState(0);

     const [isClicked, setIsClicked] = useState(false)
     const [isInitialized, setIsInitialized] = useState(false)
     const handleClickInvite = () => {
          if( userObj !== null) {
               axios.get(`${process.env.REACT_APP_SERVER}/api/join/create_code`, 
               {
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               })
               .then(res => {
                    // console.log(res.data)// 유저 초대 코드 
                    setShareUrl(`${process.env.REACT_APP_REGISTRATION}/registration?share=TRUE&ucode=${res.data}`) // 보내야 하는 url 
                    setIsClicked(!isClicked)
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }
     const getInvitedPoint = () => {
          if( userObj !== null) {
               axios.get(`${process.env.REACT_APP_SERVER}/api/join/get_point`, 
               {
                    headers : {
                    "Authorization": "Token " + userObj.auth_token,
               }
               }).then( res => {
                    updatePoint()
               })
               .catch(function(error) {
                    console.log(error);
               })
          }
     }
     const sendKakaoMessage = () => {
          window.Kakao.Link.sendDefault({
               objectType: 'feed', // 메시지 형식 : 피드 타입
               content: {
                    title: '데일리나우에 초대합니다.',
                    description: '매일이 행복한 투자 현황, 홀리랑 함께 해요!',
                    imageUrl: "https://postfiles.pstatic.net/MjAxOTExMTlfNTcg/MDAxNTc0MTI0NDc5MTY4.svckLGX-9eQGz5ysLhHa36hi_Diher0SMG6g1EDqBIMg.c7HwR2PoRYgD9buJ0QzUCD70OQveRZIbdPRbZq3gUGYg.PNG.daily-funding/holy-emo-with-deli2.png?type=w966", // 메인으로 보여질 이미지 주소
                    link: {
                         webUrl: shareUrl,
                         mobileWebUrl: shareUrl,
                    },
               },
               buttons: [
                    {
                    title: '함께 해보기', // 버튼 이름
                    link: {
                         webUrl: shareUrl,
                         mobileWebUrl: shareUrl,
                    },
                    },
               ],
               callback : () => {
                    // 친구 초대 포인트 적립 api 보내기 
                    getInvitedPoint()
               }
          });
     }
     useEffect(() => {
          if(shareUrl) {
               sendKakaoMessage()
          }
     }, [isClicked])

     useEffect(() => {
          if(!window.Kakao.isInitialized()){
               window.Kakao.init(process.env.REACT_APP_KAKAO);
               setIsInitialized(true)
          }
     }, [isInitialized])
     return (
          <Card className={classes.shareCard}>
               <CardHeader 
                    style={{textAlign: 'center'}}
                    title="공유"
                    subheader="아래 버튼을 클릭해서 친구들과 공유할 수 있어요!"
                    />
               <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                         setValue(newValue);
                    }}
                    showLabels={false}
                    className={classes.root}
                    >
                    <BottomNavigationAction 
                         className={classes.kakaoButton} 
                         onClick= {handleClickInvite} 
                         id="plusfriend-addfriend-button">
                    </BottomNavigationAction>
               </BottomNavigation>
          </Card>
     )
}
