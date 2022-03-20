import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {
  Card,
  Table,
  DatePicker,
  Input,
  Avatar,
  Button,
  Collapse,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
const { Meta } = Card;
import { Form, Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;
const { TextArea } = Input;
import { getTimeDistance } from '@/utils/utils';

import styles from './MyProductDetails.less';
const Panel = Collapse.Panel;
@connect(({ chartData, loading, eth }) => ({
  chartData,
  loading: loading.effects['chart/fetch'],
  accounts: eth.accounts,
}))

class MyProductDetails extends Component {
    state = {
        imageUrl:{},
        loading: false,
   };
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
  columns = [
    {
      title: '作品动态',
      dataIndex: 'name',
    },
    {
      title: '单价',
      dataIndex: 'price',
    },
    {
        title: '数量',
        dataIndex: 'unit',
    },
    {
        title: 'From',
        dataIndex: 'from',
    },
    {
        title: 'To',
        dataIndex: 'to',
    },
    {
      title: '时间',
      dataIndex: 'updatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

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

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }];
    const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }, {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    }];

    const text = `
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
    `;

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey } = this.state;
    const { chartData, loading: stateLoading } = this.props;
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
    } = chartData;
    const loading = propsLoding || stateLoading;
    return (
        <div>
        <Row>
            <Button type="primary" icon="edit" size='large'>修改</Button>
            <Button type="primary" icon="tag" size='large'>售卖</Button>
        </Row>
        <Row>
            <Col span={12}>
                <Row>
                <Card
                    style={{ float:'left', height:486, width: 500}}
                    cover={
                    <img
                        className={styles.introImg}
                        alt="example"
                        src="https://dongcokho1212.files.wordpress.com/2015/07/113.jpg"
                    />
                    }
                >
                    <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Andy Simsons"
                    description={<Link>This is the description</Link>}
                    />
                </Card>
                </Row>
                <Card>
                <Collapse bordered={false} defaultActiveKey={['1']}>
                  <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                    <p>{text}</p>
                  </Panel>
                  <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                    <p>{text}</p>
                  </Panel>
                  <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                    <p>{text}</p>
                  </Panel>
                </Collapse>
                </Card>
            </Col>
            <Col span={12}>
                <div>
                    作品集
                </div>
                <div>
                    伊吹五月
                </div>
                <div>
                    拥有者
                </div>
                <Card
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.online-top-search"
                  defaultMessage="Online Top Search"
                />
              }
              style={{ marginTop: 24 }}
            >
              <Row gutter={68}>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <span>
                        <FormattedMessage
                          id="app.analysis.search-users"
                          defaultMessage="search users"
                        />
                        <Tooltip
                          title={
                            <FormattedMessage
                              id="app.analysis.introduce"
                              defaultMessage="introduce"
                            />
                          }
                        >
                          <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                        </Tooltip>
                      </span>
                    }
                    gap={8}
                    total={numeral(12321).format('0,0')}
                    status="up"
                    subTotal={17.1}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <FormattedMessage
                        id="app.analysis.per-capita-search"
                        defaultMessage="Per Capita Search"
                      />
                    }
                    total={2.7}
                    status="down"
                    subTotal={26.2}
                    gap={8}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
              </Row>
              <Table
                rowKey={record => record.index}
                size="small"
                columns={columns}
                dataSource={searchData}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 5,
                }}
              />
            </Card>
                  <Card title="Card title" bordered={false}>
                    <Table columns={columns} dataSource={data} />
                  </Card>
                  <Card title="Card title" bordered={false}>
                    <Table columns={columns} dataSource={data} />
                  </Card>

                  <Card title="Card title" bordered={false}>
                    <Table columns={columns} dataSource={data} />
                  </Card>
            </Col>
        </Row>
        <Card title="Card title" bordered={false}>
                    <Table columns={columns} dataSource={data} />
          </Card>
        </div>
    );
  }
}

export default MyProductDetails;
