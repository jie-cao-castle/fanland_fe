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
  Button,
  Carousel
} from 'antd';
const { Meta } = Card;
import { getTimeDistance } from '@/utils/utils';

import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import styles from './Landing.less';

@connect(({ product, loading, eth }) => ({
  topProduct: product.topProduct,
  trendingProducts:product.trendingProducts,
  loading: loading.effects['chart/fetch'],
  accounts: eth.accounts,
}))
class Landing extends Component {
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
      type: 'product/fetchTopProduct',
    });

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
    const listData = [];

    let carouselTab1Data = [];
    let carouselTab2Data = [];
    let carouselTab3Data = [];
    if (trendingProducts) {
      for (let i = 0; i < 4; i++) {
        carouselTab1Data.push(trendingProducts[i]);
      }
      for (let i = 4; i < 8; i++) {
        carouselTab2Data.push(trendingProducts[i]);
      }
      for (let i = 8; i < 12; i++) {
        carouselTab3Data.push(trendingProducts[i]);
      }
    }

    return (
      <div>
        <div className={styles.introContainer}>
          <div className={styles.intro}></div>
          <Row justify="center">
            <Col span={7} offset={6}>
              <div className={styles.introTxt}>
                <div
                  className={styles.introMainTxt}>
                  探索、收集、出售独一无二的数字藏品NFT
                </div>
                <div
                  className={styles.introSubTxt}>
                  繁澜宇宙是全亚洲最大的数字藏品NFT平台
                </div>

                <Button type="primary" size="large"
                  style={{ width: '120px', marginLeft: '20px', marginRight: '30px', marginTop: '30px' }}>
                  探索
                </Button>
                <a href="/product/create">
                  <Button
                    style={{ width: '120px', marginTop: '30px' }}
                    size="large">
                    创造
                  </Button>
                </a>
                {accounts && accounts.length > 0 && <Button>{accounts[0]}</Button>}
              </div>
            </Col>
            <Col span={10}>
              {topProduct && topProduct.Name &&
                <Link to={topProdUrl}>
                  <Card
                    style={{ height: 'auto', marginTop: '15px', width: 500 }}
                    className={styles.introImgContainer}
                    cover={
                      <img
                        className={styles.introImg}
                        alt="example"
                        src={topProduct.ImgUrl}
                      />
                    }
                  >
                    <Meta
                      avatar={<Avatar src={topProduct.Creator.AvatarUrl} />}
                      title={topProduct.Name}
                      description={<Link>{topProduct.Creator.UserName}</Link>}
                    />
                  </Card>
                </Link>}
            </Col>
          </Row>
        </div>

        {trendingProducts && trendingProducts.length >= 12 && <div className={styles.crsl}>
            <div
              className={styles.hotTxt}>
                热门的数字藏品
            </div>
            <Carousel autoplay>
              <div>
                <Row>
                {carouselTab1Data.map(item => (
                  <Col span={4} offset={1}>
                    <MUICard sx={{ maxWidth: 375 }}>
                    <Link to={`/product/details?id=${item.Id}`}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.ImgUrl}
                        />
                      </Link>
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
                  </Col>
                ))}
                </Row>
              </div>
              <div>
                  {carouselTab2Data.map(item => (
                      <Col span={4} offset={1}>
                        <MUICard sx={{ maxWidth: 375 }}>
                        <Link to={`/product/details?id=${item.Id}`}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={item.ImgUrl}
                            />
                          </Link>
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
                      </Col>
                    ))}
              </div>
              <div>
                  {carouselTab3Data.map(item => (
                          <Col span={4} offset={1}>
                            <MUICard sx={{ maxWidth: 375 }}>
                            <Link to={`/product/details?id=${item.Id}`}>
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={item.ImgUrl}
                                />
                              </Link>
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
                          </Col>
                        ))}
              </div>
            </Carousel>
        </div>}
      </div>
    );
  }
}

export default Landing;
