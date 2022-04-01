import React, { PureComponent } from 'react';
import { List, Card, Icon, Dropdown, Menu, Avatar, Tooltip } from 'antd';
import numeral from 'numeral';
import { connect } from 'dva';
import { formatWan } from '@/utils/utils';
import stylesApplications from '../../List/Applications.less';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Masonry from '@mui/lab/Masonry';
import CardHeader from '@mui/material/CardHeader';


export default
@connect(({ product }) => ({
  trendingProducts: product.trendingProducts,
}))
class Center extends PureComponent {
  render() {
    const { trendingProducts } = this.props;
    let products = [];
    if (trendingProducts && trendingProducts.length > 0) {
      products = trendingProducts;
    }
    return (
        <Masonry style={{margin:'0 auto'}} columns={3} spacing={3}>
        {products.map((trendingProduct, index) => (
        <MUICard>
              <CardHeader
                avatar={
                  <Avatar src={trendingProduct.Creator.AvatarUrl} />
                }
                title={trendingProduct.Name}
                subheader={trendingProduct.Creator.UserName}
              />
            <a href={`/product/details?id=${trendingProduct.Id}`}>
                <CardMedia
                  component="img"
                  image={trendingProduct.ImgUrl}
                  alt="Paella dish"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {trendingProduct.Desc}
                  </Typography>
                </CardContent>
              </a>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>         
            </MUICard>
        ))}
      </Masonry>
    );
  }
}
