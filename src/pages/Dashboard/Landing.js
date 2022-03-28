import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';

import Link from 'umi/link';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  DatePicker,
  List,
  Menu,
  Dropdown,
  Avatar,
  Button,
  Carousel 
} from 'antd';
const { Meta } = Card;
import NumberedAvatar from '@/components/NumberAvatar';
import { getTimeDistance } from '@/utils/utils';

import styles from './Landing.less';

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ product, loading, eth }) => ({
  topProduct: product.topProduct,
  loading: loading.effects['chart/fetch'],
  accounts: eth.accounts,
}))
class Landing extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
    this.state = {
      salesType: 'all',
      currentTabKey: '',
      loading: true,
      rangePickerValue: getTimeDistance('year'),
    };
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchTopProduct',
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
    const { topProduct, loading: stateLoading, accounts } = this.props;
    console.log(topProduct)

    const listData = [];
    for (let i = 0; i < 5; i++) {
      listData.push({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      });
    }

    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <div>
        <div className={styles.introContainer}>
          <div className={styles.intro}></div>
          <Row align="center">
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
                  style={{ width:'120px', marginLeft:'20px', marginRight:'30px', marginTop:'30px'}}>
                    探索
                </Button>
                <a href="/product/create">
                  <Button
                    style={{ width:'120px', marginTop:'30px'}}
                    size="large">
                      创造
                  </Button>
                </a>
                {accounts && accounts.length > 0 && <Button>{accounts[0]}</Button>}
              </div>
              </Col>
            <Col span={10}>
              {topProduct.Name && <Card
                style={{ height:'auto', marginTop:'15px', width: 500}}
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
              </Card>}
            </Col>
          </Row>
        </div>
        <div>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={listData}
          renderItem={item => (
            <List.Item
              key={item.title}
            >
              <List.Item.Meta
                title={<NumberedAvatar number="1" avatar={item.avatar} />}
              />
              {item.content}
            </List.Item>
          )}
        />
        </div>
        <div>
        <Carousel>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
        </div>
      </div>
    );
  }
}

export default Landing;
