import React, { PureComponent } from 'react';
import { List, Card, Avatar } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import stylesProjects from '../../List/Projects.less';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
export default
@connect(({ product }) => ({
  trendingProducts: product.trendingProducts,
}))
class Center extends PureComponent {
  render() {
    const { trendingProducts } = this.props;
    console.log(trendingProducts)
    return (
      <List
        className={stylesProjects.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={trendingProducts}
        renderItem={item => (
          <List.Item>
            <MUICard sx={{ maxWidth: 375 }}>
              <a href={`/product/details?id=${item.Id}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.ImgUrl}
                />
              </a>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.Desc}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </MUICard>
          </List.Item>
        )}
      />
    );
  }
}
