import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
 
const Product_card = (product) => {
  return (
    <div class="d-flex">
  <div class="flex-shrink-0">
    <Card sx={{ maxWidth: 1000 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="120"
          image="https://img.freepik.com/free-photo/front-view-delicious-chocolate-cake-concept_23-2148769282.jpg?t=st=1743259832~exp=1743263432~hmac=719a230b91ca5acdf062d6eb39a79908afb99200aec10bffdcdee7709ec8855a&w=1380"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.product_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {product.product_description}<br/>
            {product.product_price}
          </Typography>
        </CardContent>
      </CardActionArea>
    <CardActions>
        <Button size="small" color="primary">
          Update
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
      </Card>
  </div>
</div>
    
  )
}

export default Product_card
