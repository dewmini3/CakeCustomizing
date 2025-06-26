import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from "axios";
import { Link } from 'react-router-dom';

const Cake_cards = ({ product }) => {
  return (
    <Link to={`/cake/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={product.image}
            alt="Cake"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product?.product_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {product?.product_description}
              <br />
              ${product?.product_price}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* <Button size="small" color="primary">Delete</Button>
          <Button size="small" color="primary">Update</Button> */}
        </CardActions>
      </Card>
    </Link>
  );
};

export default Cake_cards;
