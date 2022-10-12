import React from 'react';
import { AppBar, Toolbar, IconButton, Badge , MenuItem , Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import logo from '../../images/shopping.jpg';
import { Link, useLocation} from 'react-router-dom';

import useStyles from './styles';

const Navbar = ({total_item}) =>{
    const classes = useStyles();
    const location = useLocation();

    return(
        <div>
            <AppBar position='fixed' className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to='/' className={classes.title} variant='h6' color='inherit'>
                        <img src={logo} alt="E commerce" height='30px' className={classes.image}/>
                        Global Gadgets
                    </Typography>
                    <div className={classes.grow}/>
                    {location.pathname === '/' ? (
                    <div className={classes.button}>
                        <IconButton component={Link} to='/cart' aria-label='show item cart' color='inherit'>
                            <Badge badgeContent={total_item} overlap='rectangle' color='secondary'>
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </div> ) : null }
                </Toolbar>
            </AppBar>

        </div>
    )
}

export default Navbar;