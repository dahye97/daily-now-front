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
     author: number;
     visited: number;
     like: number;
     unlike: number
}

export default function PostBox() {
     const classes = useStyles();
     const columns: Column[] = [
          { id: 'date', align:'center', label: '날짜', minWidth: 100 },
          { id: 'title', align:'center',label: '제목', minWidth: 200 },
          { id: 'author', align:'center',label: '글쓴이', minWidth: 50 },
          { id: 'visited', align:'center',label: '조회', minWidth: 20 },
          { id: 'like', align:'center',label: '공감', minWidth: 20 },
          { id: 'unlike', align:'center',label: '비공감', minWidth: 20 },
     ];
     
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
                         {/* <TableBody>
                         {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                         return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                   const value = row[column.id];
                                   return (
                                   <TableCell key={column.id} align={column.align}>
                                   {column.format && typeof value === 'number' ? column.format(value) : value}
                                   </TableCell>
                                   );
                              })}
                              </TableRow>
                         );
                         })}
                         </TableBody> */}
                    </Table>
               </TableContainer>
               {/* <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
               /> */}
          </Paper>
     )
}
