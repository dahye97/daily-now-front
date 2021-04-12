import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { detailPostInfo } from '../../../../../Interface/Post'

import {Paper,IconButton,Typography } from '@material-ui/core/';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
const useStyles = makeStyles({
     root: {
       width: '100%',
     },
     container: {
       maxHeight: 600,
       background: "#fafafa"
     },
     content: {
          padding: '30px',
     },
     handButton: {
          textAlign: "center",
          paddingTop: "30px",
     }
   });

interface Column {
     id: 'date' | 'title' | 'author' | 'visited' | 'like' | 'unlike';
     label: string | number;
     maxWidth?: number;
     align?: 'left' | 'right';
}

   
export default function DetailPost(props: {postInfo : detailPostInfo}) {
     const classes = useStyles();
     const {postInfo} = props;
     const columns: Column[] = [
          { id: 'title', align:'left',label: postInfo.title, maxWidth: 100 },
          { id: 'visited', align:'right',label: '조회 '+postInfo.views, maxWidth: 30 },
          { id: 'like', align:'right',label: '공감 '+postInfo.like, maxWidth: 30 },
          { id: 'unlike', align:'right',label: '비공감 '+postInfo.dislike, maxWidth: 30 },
          { id: 'author', align:'left',label: postInfo.user.slice(0,4) + '****',maxWidth: 30},
          { id: 'date', align:'right', label: postInfo.date, maxWidth:100},
     ];
     const createRow = ( start: number, end : number,) => {
          return (<TableRow style={{display:"table-row"}}>
               {columns.slice(start,end).map( column => {
                    return (<TableCell
                         component="th" scope="row"
                         key={column.id}
                         style={{ maxWidth: column.maxWidth , border: "none", padding: "10px", }}
                         align={column.align}
                         >
                         {column.label}
                         </TableCell>)
               })}
          </TableRow>)
     }
     return (
          <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                         <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                   {createRow(0,4)}
                                   {createRow(4,6)}
                              </TableHead>
                              <TableBody>
                                   
                              </TableBody>
                         </Table>
                    </TableContainer>

                    {/* 글 내용 */}
                    <Paper className={classes.content}>
                         {postInfo.content}

                         {/* 공감,비공감 버튼 */}
                         <Typography component="div" className={classes.handButton}>
                              <IconButton aria-label="like">
                                   <ThumbUpAltIcon />
                              </IconButton>
                              <IconButton aria-label="dislike">
                                   <ThumbDownIcon />
                              </IconButton>
                         </Typography>
                    </Paper>
          </Paper>
     )
}
