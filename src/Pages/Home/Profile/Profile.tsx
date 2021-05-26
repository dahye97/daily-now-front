import {Card,CardHeader,CardMedia,CardContent,IconButton,Button,CardActions,Typography,Badge,Avatar,useMediaQuery,Dialog,DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import {  makeStyles,withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';
import axios from 'axios'
import { useHistory } from "react-router";
import { userInfo } from "Interface/User";
import {useEffect,useState} from 'react'
import holypig from 'asset/img/holypig.png'
// TODO: 프로필 
const useStyles = makeStyles({
	card: {
		background: "linear-gradient(145deg, #177de2, #1b95ff)",
		color: "white",
		borderRadius: "20px",
		position: 'relative'
	},
	profile: {
		width: '100%'
	}, 
	profileHoly: {
		position: 'absolute',
		right: "5%",
		bottom: 0
	},
	headerContent: {
		padding: "0 16px"
	},
	button: {
		color: "#e0e0e0",
		"&:hover": {
			color: "white",
		},
	},
	cardMedia: {
		display: 'flex',
		justifyContent:'space-evenly',
		'& button': {
			padding: '8px'
		}
	},
	controlButton: {
		color: "white",
		fontSize: "40px"
	},
	controlButtonMobile: {
		color: "white",
		fontSize: "35px",
		padding: 0,
	},
	addAccount: {
		color: "white"
	}, 
	imgInput: {
		display: "none"
	}
});

const StyledBadge = withStyles((theme) => ({
	badge: {
	  backgroundColor: '#44b700',
	  color: '#44b700',
	  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
	  '&::after': {
	    position: 'absolute',
	    top: 0,
	    left: 0,
	    width: '100%',
	    height: '100%',
	    borderRadius: '50%',
	    animation: '$ripple 1.2s infinite ease-in-out',
	    border: '1px solid currentColor',
	    content: '""',
	  },
	},
	'@keyframes ripple': {
	  '0%': {
	    transform: 'scale(.8)',
	    opacity: 1,
	  },
	  '100%': {
	    transform: 'scale(2.4)',
	    opacity: 0,
	  },
	},
   }))(Badge);

interface ProfileProps {
	userObj : userInfo | null,
	companyID: number,
	myPoint : number

	handleLogOut:() => void,
	getUserDataOfCompany: (refresh: number, id?: number) => void
	updatePoint : () => void
}
export default function Profile(props:ProfileProps) {
	const history = useHistory();
	const classes = useStyles()
	const isMobile = useMediaQuery("(max-width: 380px)");
	const {handleLogOut,getUserDataOfCompany, myPoint, updatePoint, userObj} = props;

	// mypage로 이동 
	const handleClickSetting = () => {
		history.push('/mypage');
	}
	
	const handleClickFunding = () => {
		history.push('/home?tabName=MY_FUNDING')
	}
	// 초대 코드 생성 함수 
	const handleClickShare = () => {
		history.push('/home?tabName=INVITE')
	}

	// 포인트 내역 확인 
	const handleClickPoint = () => {
		history.push('/home?tabName=POINT_TOTAL')
	}

	const handleClickRefresh = () => {
		getUserDataOfCompany(1)
	}

	const [open, setOpen] = useState(false)
	const [imgUpload, setimgUpload] = useState<FormData>()
	const handleOpen = () => {
		setOpen(!open)
	}
	const handleUploadImage = () => {
		if( userObj !== null) {
			axios
			.post(`${process.env.REACT_APP_SERVER}/api/auth/image_upload`, imgUpload,
			{
				headers : {
				"Authorization": "Token " + userObj.auth_token,
				"Content-Type": "blob"
				}
			})
			.then(res => {
				handleOpen()
				getProfileImg()
			})
			//에러가 날 경우 처리
			.catch(error => {
				console.log(error.response);
			});
			
		}
	}
	const handleEditProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.target.files !== null) {
			//FormData 생성
			const fd = new FormData();
			//FormData에 key, value 추가하기
			fd.append('filename', event.target.files[0]);
			// console.log(fd)
			
			setimgUpload(fd)
			// console.log('업로드할 이미지',imgUpload)
		}
	}

	const [profileImage, setProfileImage] = useState('')
	const getProfileImg = () => {
		if( userObj !== null) {
			axios
			.post(`${process.env.REACT_APP_SERVER}/api/auth/get_image`,
			null,
			{
				headers : { 
					"Authorization": "Token " + userObj.auth_token,
					"Content-Type" : 'application/json',
				},
				responseType: 'arraybuffer'
			})
			.then(res => {
				let blob = new Blob([res.data], { type: res.headers['content-type'] })
				// console.log(blob)
				setProfileImage(window.URL.createObjectURL(blob))		
			})	
			.catch(error => {
				console.log(error);
			});
		}
	}
	useEffect(() => {
		updatePoint()
		getProfileImg()
	}, [])

		return (
			<div className="profile">
				<Card className={classes.card} elevation={3}>
					<div style={{display:'flex', 'justifyContent':'space-between'}}>
						<CardHeader 
						title={ (props.userObj?.username && isMobile &&
							(props.userObj.username.length > 3) ? (props.userObj?.username.substring(0,3) + "..." )
							: props.userObj?.username) + " 님의"}
						component="span"
						avatar={
							<IconButton style={{padding: 0}} onClick={()=> setOpen(true)}>
								<StyledBadge
									overlap="circle"
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									variant="dot"
									>
									<Avatar src={profileImage}/>
								</StyledBadge>
							</IconButton>
						}
						></CardHeader>
						<Dialog open={open}>
							<DialogTitle>
								프로필 사진 수정하기
							</DialogTitle>
							<DialogContent>
								<input
									onChange={handleEditProfile}
									type="file"
									accept="image/png"
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleUploadImage} color="primary">
								저장하기
								</Button>
								<Button onClick={handleOpen} color="primary">
								돌아가기
								</Button>
							</DialogActions>
							
						</Dialog>
						<CardMedia className={classes.cardMedia}>
			{/* 새로고침 */}	<IconButton onClick={handleClickRefresh}><UpdateIcon className={isMobile? classes.controlButtonMobile : classes.controlButton}/></IconButton>
		{/* 회원 정보 수정 */}	<IconButton onClick={handleClickSetting}><SettingsIcon className={isMobile? classes.controlButtonMobile : classes.controlButton} /></IconButton>
			{/* 로그아웃 */}	<IconButton onClick={handleLogOut}><ExitToAppIcon className={isMobile? classes.controlButtonMobile : classes.controlButton} /></IconButton>
						</CardMedia>
					</div>
					<Typography className={classes.headerContent}>매일이 행복한 투자 현황</Typography>
					<CardContent>
						<p>보유 포인트</p>
						<h2>{myPoint ? myPoint : 0} P</h2>
					</CardContent>
					<CardActions>
						<div style={{zIndex: 2}}>
							<Button 
							onClick={handleClickFunding} className={classes.button}>나의투자</Button>
							<Button 
							onClick={handleClickPoint} className={classes.button}>포인트내역</Button>
							<Button 
							onClick={handleClickShare} className={classes.button}>공유하기</Button>
						</div>
						<div>
							<img 
							className={classes.profileHoly}
							src={holypig} width= {isMobile? "180px": "220px"}
							alt="저금통과 홀리"
							style={{zIndex: 1}}/> 
						</div>
					</CardActions>
				</Card>
			</div>
		);
}

