import React from 'react';
import { Paper, Step , Stepper, StepLabel, Typography, CircularProgress, Divider, Button , CssBaseline} from '@material-ui/core';
import useStyles from './styles';
import { useState , useEffect } from 'react';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { Link, useNavigate  } from 'react-router-dom';

const steps = ['Shipping Address' , 'Payment Details'];

const Checkout = ({cart, error, order, onCaptureCheckout}) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [ shippingData, setShippingData ] = useState({});
    const [ isFinished, setFinished ] = useState({});
    const Navigate  = useNavigate();

    useEffect( () =>{
        const generateToken = async () =>{
          try {
            const token = await commerce.checkout.generateToken(cart.id,{ type: 'cart'});

            setCheckoutToken(token)
          } catch (error) {
            Navigate('/')
          }
        }
        generateToken();
    }, [])

    let Confirmation = () => order.customer ? (
      <>
            <div>
                <Typography variant='h6'>Thank You for the purchase,{order.customer.firstName} {order.customer.lastName}</Typography>
                <Divider className={classes.divider}/> 
                <Typography variant='h5'> Ref: {order.customer_reference}</Typography> 
                
            </div>
            <br />
         <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>  
      </>
      ) : isFinished ? (
        <>
        <div>
            <Typography variant='h6'>Thank You for the purchase</Typography>
            <Divider className={classes.divider}/>             
        </div>
        <br />
     <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>  
  </>
      ) : (
        <div className={classes.spinner}>
             <CircularProgress />
        </div>
     );

    if(error){
      <>
         <typography variant='h5' >Error: {error}</typography>
         
         <br />
         <Button component={Link} to='/' variant='outlined' type='button'>Back to home</Button>
      </>
    }

    const nextStep = () => setActiveStep((previousStep) => previousStep + 1);
    const backStep = () => setActiveStep((previousStep) => previousStep - 1);

    const next = (data) =>{
       setShippingData(data)

       nextStep();
    }

    const timeout = () =>{
      setTimeout(() => {
        setFinished(true)
      }, 3000);
    }

    const Form = () => activeStep === 0 
    ? <AddressForm checkoutToken={checkoutToken} next={next}/> : 
    <PaymentForm timeout={timeout} shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout}/> 

  return (
    <>
    <CssBaseline />
        <div className = {classes.toolbar}/>
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant='h4' align='center'>Checkout</Typography>
             <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((step) =>(
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                ))}        
             </Stepper>   
              {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>

        </main>
        
    </>
  )
}

export default Checkout;