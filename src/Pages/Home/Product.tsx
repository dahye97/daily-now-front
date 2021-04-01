import React from 'react'
import {Card,CardHeader,Avatar,IconButton,CardMedia,CardContent,Typography,CardActions,Collapse} from '@material-ui/core';
import clsx from 'clsx';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import yangpyeong from '../../asset/img/yangpyeong.jpg'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 300,
      margin: "20px"
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: "red",
    },
  }),
);

export default function Product() {
     const classes = useStyles()
     const [expanded, setExpanded] = React.useState(false);

     const handleExpandClick = () => {
       setExpanded(!expanded);
     };
     return (
               <Card className={classes.root}>
                    <CardHeader avatar={<Avatar aria-label="recipe" className={classes.avatar}>
                         J </Avatar>}
                    action={ <IconButton aria-label="settings"><MoreVertIcon /></IconButton> }
                    title="데일리 펀딩"
                    subheader="04 01, 2021"
                    />

                    {/* 상품 이미지 */}
                    <CardMedia className={classes.media} image={yangpyeong}  title="양평 타운하우스" />
                    
                    {/* 상품 제목 */}
                    <CardContent>
                         <h3>양평 서종 타운하우스 건축사업 8차</h3>   
                         <Typography variant="body2" color="textSecondary" component="h1">
                         마감이 빠른 상품!
                         </Typography>
                    </CardContent>
                   
                    <CardActions disableSpacing>
                         <IconButton aria-label="add to favorites"><FavoriteIcon /></IconButton>
                         <IconButton aria-label="share"><ShareIcon /></IconButton>
                         <IconButton
                              className={clsx(classes.expand, {
                              [classes.expandOpen]: expanded,
                              })}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more"
                         >
                              <ExpandMoreIcon />
                         </IconButton>
                    </CardActions>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                         <Typography paragraph>상품 설명</Typography>
                    </CardContent>
                    </Collapse>
               </Card>
     )
}
