import React, { useState} from 'react';
import { Grid, Typography, Button, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField';
import { commerce } from '../../lib/commerce';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddressForm = ({ checkoutToken, next }) => {
  console.log('next', next);
      const methods = useForm();
      const [shippingCountries, setShippingCountries]= useState([]);
      const [shippingCountry, setShippingCountry] = useState('');
      const [shippingDivisions, setShippingDivisions] = useState([]);
      const [shippingDivision, setShippingDivision] = useState('');
      const [shippingOptions, setShippingOptions] = useState([]);
      const [shippingOption, setShippingOption] = useState('');

      const countries =  Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}));
      const subdivisions = Object.entries(shippingDivisions).map(([code, name]) => ({id: code, label: name}));
      const options = shippingOptions.map((so) =>({ id: so.id, label:`${so.description} - (${so.price.formatted_with_symbol})`}))

      const fetchCountries = async (checkoutTokenId) =>{
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
      }

      const fetchSubdivisions = async (countryCode) =>{
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
        setShippingDivisions(subdivisions)
        setShippingDivision(Object.keys(subdivisions)[0])
      }

      const fetchShippingOptions = async (checkoutTokenId, country, region = null) =>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})
        setShippingOptions(options);
        setShippingOption(options[0].id);
      }

      useEffect( () =>{
             fetchCountries(checkoutToken.id);
      },[])

      useEffect(() =>{
          if(shippingCountry) fetchSubdivisions(shippingCountry)
      },[shippingCountry])

      useEffect(() =>{
        if(shippingDivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingDivision)
      }, [shippingDivision])

   return (
    <>
          <Typography variant='h4' gutterBottom>Shipping Address</Typography>
             <FormProvider {...methods}>
                <form onSubmit = {methods.handleSubmit((data) => next({...data, shippingCountry, shippingDivision, shippingOption}))}>
                  <Grid container spacing={3}>
                      <FormInput required name='firstName' label='First Name' />
                      <FormInput required name='lastName' label='Last Name' />
                      <FormInput required name='Address' label='Address' />
                      <FormInput required name='email' label='Email Address' />
                      <FormInput required name='city' label='City' />
                      <FormInput required name='zipCode' label='Zip Code' /> 
                        
                       <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Country</InputLabel>
                        <Select value={shippingCountry} fullWidth onChange={((e) =>setShippingCountry(e.target.value))}>
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.label}
                             </MenuItem>
                          ))}             
                           
                        </Select>
                      </Grid> 
                      <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping SubDivisions</InputLabel>
                        <Select value={shippingDivision} fullWidth onChange={((e) => setShippingDivision(e.target.value))}>
                          {subdivisions.map((subdivision) =>(
                            <MenuItem key={subdivision.id} value={subdivision.id}>
                              {subdivision.label} 
                             </MenuItem>
                          ))}
                        </Select>
                      </Grid>    
                      <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Divisions</InputLabel>
                        <Select fullWidth value={shippingOption} onChange={((e) => setShippingOption(e.target.value))}>
                            {options.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </Grid>  
                  </Grid> 
                  <br />
                  <div style={{ display: 'flex' , justifyContent:'space-between'}}>
                    <Button component={Link} to="/cart" variant='outlined'>Back to Cart</Button>
                    <Button type='submit' variant='contained' color='primary'>Next</Button>
                  </div>
                </form>
             </FormProvider>
    </>
  )
}

export default AddressForm;