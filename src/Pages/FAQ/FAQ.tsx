import React, { useEffect,useState } from 'react'
import axios from 'axios';

import {Container,Typography } from '@material-ui/core';
import { makeStyles, } from "@material-ui/core/styles";
import { faqInfo } from '../../Interface/FAQ';
import FAQItem from './Components/FAQItem'

const useStyles = makeStyles({
     faqContainer: {
          padding: "20px",
		marginTop: "80px",
          marginBottom: "80px",
          borderRadius: "23px",
     }
})

export default function FAQ() {
     const classes = useStyles()

     const [faqList, setFaqList] = useState<faqInfo[]>([])
     const getFAQData = () => {
          axios.post('http://192.168.0.69:8000/api/notice/faq_list', {
               page_size: 10
          }).then(res => {
               console.log(res.data)
               setFaqList(res.data.results)
          })
          .catch(function(error) {
               console.log(error);
          })  
     }
     useEffect(() => {
          getFAQData()
     }, [])
     return (
          <Container maxWidth="md" className={classes.faqContainer}>
               <h2>📌 자주 묻는 질문 </h2>
               <Typography component="div" style={{height: '100vh'}}>

                    {faqList.map( (faq,index) => {
                         return ( 
                              <>
                              <FAQItem key={index} faq={faq} />
                              </>
                         )
                         })}
               
                    
               </Typography>
          </Container>
     )
}
