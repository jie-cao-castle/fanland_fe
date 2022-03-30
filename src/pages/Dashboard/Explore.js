import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { stringify } from 'qs';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Avatar,
  Tabs,
  Carousel
} from 'antd';
const { TabPane } = Tabs;
const { Meta } = Card;
import { getTimeDistance } from '@/utils/utils';
import { red } from '@mui/material/colors';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import styles from './Explore.less';
import Masonry from '@mui/lab/Masonry';
import { Paper } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@connect(({ product, loading, eth }) => ({
  trendingProducts:product.trendingProducts,
}))
class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesType: 'all',
      currentTabKey: '',
      loading: true,
    };
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchTrendingProducts',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {
    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey } = this.state;
    const { topProduct, trendingProducts, loading: stateLoading, accounts } = this.props;
    let topProdUrl = "";
    if (topProduct) {
      topProdUrl = ("/product/details/?id=" + topProduct.Id);
    }


    return (
      <div>
        {trendingProducts && trendingProducts.length >= 0 &&
        <div style={{width:'100%'}}>
            <div
              className={styles.hotTxt}>
                探索所有的数字藏品
            </div>
              <div style={{width:'420px', margin:'0 auto'}}>
                <RadioGroup  defaultValue="a" size="large">
                        <RadioButton value="a">所有</RadioButton>
                        <RadioButton value="b">数字藏品</RadioButton>
                        <RadioButton value="c">手办</RadioButton>
                        <RadioButton value="d">数字唱片</RadioButton>
                        <RadioButton value="c">游戏卡装</RadioButton>
                </RadioGroup>
                </div>
                 <Masonry style={{width:'70%', margin:'0 auto'}} columns={3} spacing={3}>
                  {trendingProducts.map((trendingProduct, index) => (
                  <MUICard>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: red[500] }} src={trendingProduct.Creator.AvatarUrl} />
                          }
                          title={trendingProduct.Name}
                          subheader={trendingProduct.Creator.UserName}
                        />
                       <Link to={`/product/details?id=${trendingProduct.Id}`}>
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
                        </Link>
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
        
      </div>
        }
      </div>
    );
  }
}

export default Explore;
