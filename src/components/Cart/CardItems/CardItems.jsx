import React from 'react';
import {Typography, Card, Button, CardMedia, CardActions, CardContent} from '@material-ui/core';
import useStyles from './styles';

const CardItems = ({item, handleRemoveFromCart, handleUpdateCart}) => {
    const classes= useStyles();
    
  return (
    <Card>
        <CardMedia className={classes.media} image={item.image?.url}/>
            <CardContent className={classes.cardContent}>
                <Typography variant='h4'>{item.name}</Typography>
                <Typography variant='h5'>{item.line_total.formatted_with_symbol}</Typography>
            </CardContent>
            <CardActions className={classes.CardActions}>
                <div className={classes.buttons}>
                    <Button type='button' size='small' onClick={() => handleUpdateCart(item.id, item.quantity - 1)}>-</Button>
                    <Typography>{item.quantity}</Typography>
                    <Button type='button' size='small' onClick={() => handleUpdateCart(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant='contained' type='button' color='secondary' onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
            </CardActions>

    </Card>
      )
}

export default CardItems;