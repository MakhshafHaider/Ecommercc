import React, { useState, useEffect } from 'react';
import Products from './components/Products/products';
import Navbar from './components/naavbar/Navbar';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';
import {commerce} from './lib/commerce';
import {BrowserRouter as Router, Routes,Route } from 'react-router-dom';

const App = () =>{
   const [products, setProducts] = useState([]);
   const [cart,setCart] = useState({});
   const [order, setOrder] = useState({});
   const [errorMessage, setErrorMessage] = useState('');

   const fetchProucts = async () =>{
         const {data} = await commerce.products.list();
         setProducts(data)
   }

   const fetchCart = async () =>{
        setCart(await commerce.cart.retrieve());
   }

   const handleAddToCart = async (productId, quantity) =>{
       const item = await commerce.cart.add(productId, quantity);
       setCart(item)
   }

   const handleUpdateCart = async (productId, quantity ) =>{
     const response = await commerce.cart.update(productId, {quantity})
     setCart(response);
   }

   const handleEmptyCart = async () =>{
    const response =  await commerce.cart.empty();
    setCart(response);
   }

   const handleRemoveFromCart = async (productId) =>{
           const response = await commerce.cart.remove(productId);
           setCart(response)       
   }
   const refreshCart = async () =>{
         const newCart = await commerce.cart.refresh();

         console.log('newCart', newCart)

         setCart(newCart);
   }

   const handleCaptureCheckout = async (checkoutTokenId, newOrder ) =>{
    try {
        const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
        setOrder(incomingOrder);
        refreshCart();
    } catch (error) {
        setErrorMessage(error.data.error.message)
    }
   }

   useEffect(() =>{
          fetchProucts();
          fetchCart();
   }, [])

    return(
        <Router>
            <div>
             <Navbar total_item={cart.total_items}/>
            <Routes>
                <Route exact path='/'element={ <Products products={products} onAddToCart={handleAddToCart} />} />         
                <Route exact path='/cart' element={<Cart 
                cart={cart}
                handleUpdateCart={handleUpdateCart}
                handleRemoveFromCart={handleRemoveFromCart}
                handleEmptyCart={handleEmptyCart}
                />} />
                <Route exact path='/checkout' element={<Checkout
                 cart={cart} 
                 onCaptureCheckout = {handleCaptureCheckout}
                 error={errorMessage} 
                 order={order}/>} />    
            </Routes>
            </div>
        </Router>
    )
}

export default App;