import React, {useState} from 'react'
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {detailPostInfo, postInfo} from '../../../../../Interface/Post'
import { useHistory } from 'react-router';
import DetailPost from './DetailPost';

const useStyles = makeStyles({
     root: {
       width: '100%',
     },
     container: {
       maxHeight: 600,
     },
   });

interface Column {
     id: 'date' | 'title' | 'author' | 'visited' | 'like' | 'unlike';
     label: string;
     minWidth?: number;
     align?: 'center';
}

interface PostBoxProps {
     postList : postInfo
     rowsPerPage: number
     page:number
     handleChangePage: any
     handleChangeRowsPerPage:any
}
// 실제 탭 패널 내용 
export default function PostBox(props: PostBoxProps) {
     const classes = useStyles();
     const history = useHistory();
     const { postList, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage } = props;
     const { count, results } = postList;

     const columns: Column[] = [
          { id: 'date', align:'center', label: '날짜', minWidth: 100 },
          { id: 'title', align:'center',label: '제목', minWidth: 200 },
          { id: 'author', align:'center',label: '글쓴이', minWidth: 50 },
          { id: 'visited', align:'center',label: '조회', minWidth: 20 },
          { id: 'like', align:'center',label: '공감', minWidth: 20 },
          { id: 'unlike', align:'center',label: '비공감', minWidth: 20 },
     ];
     

     // 게시글 조회수 업데이트 및 상세 게시글 페이지로 이동 
     const handleClickPost = (postId : number) : void => {
          axios.post('http://192.168.0.69:8000/api/notice/update_view', {
                    post_id: postId
               }).then(res => {
               console.log(res)
               history.push(`/board/detail/${postId}`, {
                    post_id: postId
               })
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     
     return (
          <>

               <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                         <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                   <TableRow>
                                   {columns.map((column) => (
                                        <TableCell
                                        key={column.id}
                                        style={{ minWidth: column.minWidth }}
                                        >
                                        {column.label}
                                        </TableCell>
                                   ))}
                                   </TableRow>
                              </TableHead>

                                   <TableBody>
                                        {results.map((row) => {
                                             return (
                                                  <TableRow hover role="checkbox" tabIndex={-1} 
                                                       key={row.post_id} onClick={() => handleClickPost(row.post_id)}
                                                       style={{ cursor: "pointer"}}>
                                                       <TableCell>{row.date}</TableCell>
                                                       <TableCell>{row.title}</TableCell>
                                                       <TableCell>{row.user.slice(0,4) + '****'}</TableCell>
                                                       <TableCell align="center">{row.views}</TableCell>
                                                       <TableCell align="center">{row.like}</TableCell>
                                                       <TableCell align="center">{row.dislike}</TableCell>
                                                  </TableRow>
                                        );
                                        })}
                                   </TableBody>
                              
                         </Table>
                    </TableContainer>

                    <TablePagination
                         rowsPerPageOptions={[10, 25, 100]}
                         component="div"
                         count={count}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onChangePage={handleChangePage}
                         onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    </Paper>

          </>
     )
}
