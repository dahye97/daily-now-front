import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {postInfo} from '../../../../../Interface/Post'

const useStyles = makeStyles({
     root: {
       width: '100%',
     },
     container: {
       maxHeight: 440,
     },
   });

interface Column {
     id: 'date' | 'title' | 'author' | 'visited' | 'like' | 'unlike';
     label: string;
     minWidth?: number;
     align?: 'center';
}

interface Data {
     date: string;
     title: string;
     user: string;
     visited: number;
     like: number;
     unlike: number
}

interface PostBoxProps {
     postList : Array<postInfo>
}
export default function PostBox(props: PostBoxProps) {
     const classes = useStyles();
     const { postList, } = props;
     const columns: Column[] = [
          { id: 'date', align:'center', label: '날짜', minWidth: 100 },
          { id: 'title', align:'center',label: '제목', minWidth: 200 },
          { id: 'author', align:'center',label: '글쓴이', minWidth: 50 },
          { id: 'visited', align:'center',label: '조회', minWidth: 20 },
          { id: 'like', align:'center',label: '공감', minWidth: 20 },
          { id: 'unlike', align:'center',label: '비공감', minWidth: 20 },
     ];
     
     const [page, setPage] = React.useState(0);
     const [rowsPerPage, setRowsPerPage] = React.useState(10);
   
     const handleChangePage = (event: unknown, newPage: number) => {
       setPage(newPage);
     };
   
     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
       setRowsPerPage(+event.target.value);
       setPage(0);
     };

     return (
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
                              {postList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                   console.log(row)
                                   return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.post_id}>
                                             <TableCell>{row.date}</TableCell>
                                             <TableCell>{row.title}</TableCell>
                                             <TableCell>{row.user}</TableCell>
                                             <TableCell>{row.views}</TableCell>
                                             <TableCell>{row.like}</TableCell>
                                             <TableCell>{row.dislike}</TableCell>
                                        </TableRow>
                              );
                              })}
                         </TableBody>
                    </Table>
               </TableContainer>
               <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={postList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
               />
          </Paper>
     )
}
