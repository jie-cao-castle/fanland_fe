import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {
  Card,
  Tabs,
  DatePicker,
  Input,
  Avatar,
  Button,
  Modal,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';
import moment from 'moment';
const { Meta } = Card;
import { Form, Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;
const { TextArea } = Input;
import { getTimeDistance, getPageQuery } from '@/utils/utils';
import styles from './ProductCreate.less';
import product from '@/models/product';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ eth, product }) => ({
  productDetails: product.productDetails,
  accounts: eth.accounts,
  contract: eth.contract,
}))

class ProductDetails extends Component {
    state = {
        imageUrl:{},
        loading: false,
        visible: false,
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
    const params = getPageQuery();
    let { id } = params;
    const { dispatch } = this.props;
      dispatch({
        type: 'product/fetch',
        payload: {
          id: parseInt(id, 10),
        },
      });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/clear',
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
  
  handleSellOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  handleSellCancel = () => {
    this.setState({ visible: false });
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
    const { productDetails, contract } = this.props;
    let productData = {};
    if (productDetails) {
      productData = productDetails.product;
    }
    const { visible, loading } = this.state;
    return (
        <div>
        <Row>
            <Button type="primary" icon="edit" size='large'>Edit</Button>
            <Button type="primary" icon="tag" size='large' onClick={this.showModal}>Sell</Button>
        </Row>
        <Row>
            <Col>
                 {productData && <Card 
                    style={{ float:'left', height:486, width: 500}}
                    cover={
                    <img
                        className={styles.introImg}
                        alt="example"
                        src={productData.ImgUrl}
                    />
                    }
                >
                    <Meta
                    avatar={<Avatar src={productData.Creator.AvatarUrl} />}
                    title={productData.Creator.UserName}
                    description={<Link>{productData.Name}</Link>}
                    />
                </Card>
                }
            </Col>
            <Col>
                <div>
                    作品集
                </div>
                <div>
                    伊吹五月
                </div>
                <div>
                    拥有者
                </div>
            </Col>
        </Row>
        <Row>

        </Row>
        <Modal
          visible={visible}
          title="Title"
          onOk={this.handleSellOk}
          onCancel={this.handleSellCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleSellCancel}>Return</Button>,
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleSellOk}>
              Submit
            </Button>,
          ]}
        >
                <Form layout='vertical'
                >
                  <Form.Item label="Price">
                  <Input.Group compact>
                      <Select defaultValue="ETH">
                          <Option value="ETH">ETH</Option>
                          <Option value="FLD">FLD</Option>
                      </Select>
                      <InputNumber min={1} max={180} defaultValue={7} style={{ width: 300, textAlign: 'center' }} placeholder="Minimum" />               
                      </Input.Group>
                  </Form.Item>
                  <Form.Item label="Duration">
                      <RangePicker
                      ranges={{
                          Today: [moment(), moment()],
                          'This Month': [moment().startOf('month'), moment().endOf('month')],
                      }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                      />
                  </Form.Item>
                  {contract && <Card>{contract.address}</Card>}
                </Form>
        </Modal>
        </div>
    );
  }
}

export default ProductDetails;
