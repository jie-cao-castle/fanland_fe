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
import {

  Pie,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import NumberedAvatar from '@/components/NumberAvatar';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './Landing.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
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
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
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

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
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
    const { chart, loading: stateLoading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const loading = propsLoding || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: (
          <FormattedMessage
            id="app.analysis.table.search-keyword"
            defaultMessage="Search keyword"
          />
        ),
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: (
          <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
        ),
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
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
            <Col span={10}>
              <div className={styles.introTxt}>
                <div
                  className={styles.introMainTxt}>
                  Discover, collect, and sell extraordinary NFTs
                </div>
                <div
                  className={styles.introSubTxt}>
                  OpenSea is the world's first and largest NFT marketplace
                </div>
                <Button type="primary" size="large"
                  style={{ width:'120px', marginLeft:'20px', marginRight:'30px', marginTop:'30px'}}>
                    探索
                </Button>
                <Button
                  style={{ width:'120px', marginTop:'30px'}}
                  size="large">
                    创造
                </Button>
              </div>
              </Col>
            <Col span={10}>
              <Card
                style={{ float:'right', height:586, width: 500}}
                cover={
                  <img
                    className={styles.introImg}
                    alt="example"
                    src="https://www.ruanjia.com//img/1313553176.jpg"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Andy Simsons"
                  description={<Link>This is the description</Link>}
                />
              </Card>
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
        <Carousel afterChange={onChange}>
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
