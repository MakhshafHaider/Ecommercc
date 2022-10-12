import React from 'react'
import Review from './Review';
import { Typography, Divider, Button } from "@material-ui/core";
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';  

const stripePromise =  loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({checkoutToken , backStep, onCaptureCheckout, shippingData, nextStep, timeout}) => {
  console.log('shippingData', shippingData);

  const handleSubmit = async ( event, elements, stripe ) =>{
        event.preventDefault();

        if(!stripe || !elements) return;
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod} = await stripe.createPaymentMethod({ type: 'card' , card: cardElement });

        if(error){
          console.log(error);
        }
        else{
          const OrderData = {
            line_items: checkoutToken.line_items,
            customer: { firstName: shippingData.firstName, lastName: shippingData.lastName, email: shippingData.email },
            shipping : {
              name: 'Primary',
              street: shippingData.address1,
              town_city: shippingData.city,
              country_state: shippingData.shippingSubdivision,
              postal_zip_code: shippingData.zip,
              country: shippingData.shippingCountry
            },
            fullilment : {
              shippingMethod: shippingData.shippingOption
            },
            payment:{
              gateway: 'stripe',
              stripe: {
                payment_metho_id : paymentMethod.id
              }
            }
          }

          onCaptureCheckout(checkoutToken.id, OrderData);
          timeout();
          nextStep();
        }


  };

  return (
    <div>
      <Review checkoutToken={checkoutToken}/>
      <Divider />
      <Typography variant='h6' gutterBottom style={{ margin : ' 10px 0 '}}>Payment Method</Typography>
      <Elements stripe={stripePromise}>
         <ElementsConsumer>
          {({elements, stripe}) =>(
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /> <br />
              <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                    Pay { checkoutToken.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
         </ElementsConsumer>

      </Elements>
    </div>
  )
}

export default PaymentForm