import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';

const Help = () => {
  // Sample content for the help items
  const helpItems = [
    { title: 'Help Item 1'},
    { title: 'Help Item 2'},    
     { title: 'Help Item 3'}
  ];

  // Sample FAQ data with questions and answers
  const faqItems = [
    {
      question: 'What is currency exchange and how does your platform work?',
      answer:
        'Currency exchange is the process of converting one currency into another. Our platform connects buyers and sellers looking to exchange different currencies based on their current market rates. Users can list their exchange offers and negotiate directly with each other.',
    },
    {
      question: 'How do I start exchanging currencies on your platform?',
      answer:
        'To begin, you need to create an account and verify your identity. Once logged in, you can browse existing exchange offers or create your own listing. Follow the steps provided to finalize the transaction securely.',
    },
    {
      question: 'What currencies can I exchange on your platform?',
      answer:
        'We support a wide range of currencies from around the world. You can exchange popular currencies like USD, EUR, GBP, etc., as well as less common ones. Our platform updates exchange rates in real-time to reflect current market conditions.',
    },
    {
      question: 'Are there any fees for using your currency exchange service?',
      answer:
        'We charge a small transaction fee for each exchange to cover operational costs and maintain the platform’s functionality. The fee structure is transparent and displayed before you confirm any transaction.',
    },
    {
      question: 'How long does a typical currency exchange take?',
      answer: 'The duration of an exchange can vary based on factors such as the currencies involved, transaction volume, and payment methods. Sellers typically indicate their preferred timeline for completing exchanges, and buyers can choose accordingly.',
    },
    {
      question: 'What payment methods are accepted for currency exchanges?',
      answer: 'We support various payment methods depending on the preferences of the buyers and sellers involved. Common methods include bank transfers, digital wallets, and other secure online payment systems. Ensure that the chosen method is agreed upon by both parties.',
    },
    {
      question: 'How can I resolve disputes or issues with a currency exchange?',
      answer: 'If you encounter any problems during an exchange, we encourage you to communicate directly with the other party to find a resolution. Our support team is also available to assist and can intervene if necessary to ensure fair outcomes.',
    },
    {
      question: 'Can I trust the sellers and buyers on your platform?',
      answer: 'While we strive to create a trustworthy environment, it’s important for users to exercise caution and conduct due diligence when engaging in transactions. Reading reviews, verifying identities, and following our guidelines can help mitigate risks.',
    },
    {
      question: 'How can I contact customer support for further assistance?',
      answer: 'For additional assistance or inquiries, you can reach our customer support team through the contact form on our website. We aim to respond promptly to all messages and provide comprehensive support to our users.',
    },
  ];

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        className="font-bold text-center mb-6"
        sx={{
          fontFamily: 'Arial Black, sans-serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        Help
      </Typography>
      <br />
      {/* Help Section */}
      <Grid container spacing={3}>
        {helpItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper style={{ padding: '20px', height: '100%' }}>
              <Typography variant="h6" component="h2">
                {item.title}
              </Typography>
              <Typography component="p" style={{ marginBottom: '10px' }}>
                {item.content}
              </Typography>
              <iframe
                width="100%"
                height="200px"
                src="https://www.youtube.com/embed/rYQgy8QDEBI" // Updated video URL
                title="Instructional Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <br /><br />
      <br />
      <br />

      {/* FAQ Section */}
      <Typography
        variant="h4"
        component="h2"
        className="font-bold text-center mb-6"
        sx={{
          fontFamily: 'Arial Black, sans-serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        FAQ
      </Typography>
      {faqItems.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Help;
