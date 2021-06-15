import {Typography,Accordion,AccordionSummary,AccordionDetails  } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { faqInfo } from 'Interface/FAQ';

interface FAQItemProps {
     faq: faqInfo
}
export default function FAQItem(props:FAQItemProps) {
     const { faq } = props
     return (
          <Accordion style={{padding: '10px'}}>
                    <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                         aria-controls="panel1a-content"
                         id="panel1a-header"
                    >
                         <Typography>Q. {faq.question} ?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                         <Typography>
                         {faq.answer}
                         </Typography>
                    </AccordionDetails>
          </Accordion>
     )
}
