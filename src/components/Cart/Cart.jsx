import React from 'react';
import { Container, Typography, Button, Grid} from '@material-ui/core';
import useStyles from './styles';
import CardItems from './CardItems/CardItems';
import { Link } from 'react-router-dom';

const Cart = ({cart , handleUpdateCart, handleRemoveFromCart, handleEmptyCart}) => {
    const classes = useStyles(); 

    const EmptyCart = () =>(
            <Typography variant='h2' >Your Cart is Empty
            <Link to='/' className={classes.link}> Start Ading some</Link>
            </Typography>
    );
    const FilledCart= () =>(
        <>
             <Grid container spacing={3}>
                {cart.line_items.map((item) =>{
                   return <Grid item xs={12} sm={4} key={item.id}>
                        <CardItems item={item} handleUpdateCart={handleUpdateCart} handleRemoveFromCart={handleRemoveFromCart}  />
                    </Grid>
                })}
             </Grid>
             <div className={classes.cardDetails}>
                <Typography variant='h3'> SubTotal: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>

                <Button color='secondary' className={classes.emptyButton} size='large' type='button' variant='contained' onClick={handleEmptyCart}>Empty Cart</Button>
                <Button component={Link} to='/checkout' color='primary' className={classes.checkoutButton} size='larger' type='button' variant='contained'>Checkout</Button>
                </div>
             </div>
        </>
    )

    if(!cart.line_items){
        return <>Loaddding</>
    }
   
  return(
    <Container>
        <div className={classes.toolbar} />
        <Typography variant='h2' className={classes.title} gutterBottom>Your shopping cart</Typography>
         {!cart.line_items.length ? <EmptyCart /> : <FilledCart/>} 

    </Container>
 )
  }

export default Cart;