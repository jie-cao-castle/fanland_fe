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
import { getTimeDistance, getPageQuery } from '@/utils/utils';
import styles from './MyProductDetails.less';
import {
  chainCurrencyMap,
} from '../../assets/constants.json'


const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ eth, product, user }) => ({
  currentUser: user.currentUser,
  productDetails: product.productDetails,
  accounts: eth.accounts,
  contract: eth.contract,
  chainId: eth.chainId,
  productContracts: product.productContracts,
  ethContract: product.ethContract,
}))
@Form.create()
class MyProductDetails extends Component {
    state = {
        imageUrl:{},
        loading: false,
        visible: false,
        nftOrders: [],
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
      dispatch({
        type: 'product/fetchProductContracts',
        payload: {
          productId: parseInt(id, 10),
        },
        callback: (response) => {
          console.log("fetchProductContracts", response)
          if (response.success) {
            const contract = response.result[0];
            if (contract.Status == 0) {
              dispatch({
                type: 'product/queryContract',
                payload: {
                  contractAddress: contract.ContractAddress,
                },
                callback: (response) => {
                  console.log("queryContract", response)
                      dispatch({
                        type: 'product/updateContract',
                        payload: {
                          id: contract.Id,
                          status: 1
                        },
                      });
                }
              });
            }
          }
        }
      });
      dispatch({
        type: 'product/getNftOrders',
        payload: {
          productId: parseInt(id, 10),
        },
        callback: (response) => {
          console.log("getNftOrders", response)
  
          if (response.success && response.result && response.result.length > 0) {
            let orders = response.result;
            for (let i = 0; i < orders.length; i++) {
              console.log("getNftOrder", orders[i])
              if (orders[i].Status == 0) {
                dispatch({
                  type: 'product/getTrans',
                  payload: {
                    transactionHash: orders[i].TransactionHash,
                  },
                  callback: (response) => {
                    console.log("getTrans", response)
                        dispatch({
                          type: 'product/updateNftOrders',
                          payload: {
                            id: orders[i].Id,
                            status: response.status
                          },
                          callback: (response) => {
                            console.log("updateNftOrder", response)
                            if (response && response.success) {
                              orders[i].Status = 0;
                            }
                          }
                        });
                  }
                });
              }
            }

            this.setState({ nftOrders: orders });
          }

        }
      });
      dispatch({
        type: 'eth/queryChainId',
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

  handleCreateContract = e => {
    const { dispatch, form, chainId } = this.props;
    const params = getPageQuery();
    let { id } = params;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      dispatch({
        type: 'eth/deployContract',
        payload: {
          name: 'TST',
          symbol: 'TST',
          initialNumber: 1,
        },
        callback: (response) => {
          console.log("deploycontract", response)
          if (response.address) {
            dispatch({
              type: 'product/createContract',
              payload: {
                productId: parseInt(id, 10),
                chainId : chainId,
                chainCode:chainCurrencyMap[chainId.toString()],
                contractAddress: response.address,
                tokenSymbol: 'TST',
                tokenName: 'TST',
                status: 0,
                tokenAmount:10,
                nextTokenId:1,
              }
            });
          }
        }
      });
    });
  };

  handleBuy = (e) => {
    e.preventDefault();
    const { dispatch, productContracts } = this.props;
    dispatch({
      type: 'product/buyNft',
      payload: {
        price: 0.05,
        contractAddress: productContracts[0].ContractAddress,
      },
      callback: (response) => {
        if (response && response.hash) {
          dispatch({
            type: 'product/createNftOrder',
            payload: {
              ...productData,
              transactionHash
            }
          });
        }
      }
    });
  }

  handleGetTransaction = (e) => {
    e.preventDefault();
    const { dispatch, productContracts } = this.props;
    dispatch({
      type: 'product/getTrans',
      payload: {
        transactionHash: 'aaa'
      },
      callback: (response) => {
        /*
        if (response.transactionHash) {
          dispatch({
            type: 'product/createNftOrder',
            payload: {
              ...productData,
              transactionHash
            }
          });
        }
        */
      }
    });
  }

  handleSale = (e) => {
    const { dispatch, productDetails,chainId, productContracts, currentUser } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        dispatch({
          type: 'product/setPrice',
          payload: {
            contractAddress: productContracts[0].ContractAddress,
          },
          callback: (response) => {
            if (response && response.hash) {
              console.log("setPrice", response)
              dispatch({
                type: 'product/createSale',
                payload: {
                  productId: productDetails.product.Id,
                  chainId :  chainId,
                  chainCode:"ETH",
                  contractId: productContracts[0].Id,
                  price:values.price * 1000000,
                  priceUnit: 6,
                  startTime: values.saleTimeRange[0].format(),
                  endTime:values.saleTimeRange[0].format(),
                  effectiveTime:values.saleTimeRange[0].format(),
                  status: 0,
                  fromUserId: currentUser.Id
                },
                callback: (response) => {
                  if (response && response.success) {
                      message.success('成功创建NFT');
                      this.setState({ loading: false, visible: false });
                  }
                }
              });
            }
          }
        });

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
    const { productDetails, contract, accounts, chainId, productContracts } = this.props;
    console.log(chainId)

    let productData = {};
    let sales = {};
    if (productDetails) {
      productData = productDetails.product;
      sales = productDetails.sales;
    }    
    console.log(sales);

    const hasAccounts = accounts && accounts.length > 0;
    const hasContracts = productContracts && productContracts.length > 0;
    const salesEnabled = hasAccounts && hasContracts;

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, loading, nftOrders } = this.state;
    console.log(nftOrders)
    return (
        <div>
        <Row>
            <Button type="primary" icon="edit" size='large'>编辑</Button>
            <Button type="primary" icon="tag" size='large' onClick={this.showModal}>售卖</Button>
        </Row>
        <Row>
            <Col>
                 {productData && productData.Creator && <Card 
                    style={{ float:'left'}}
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

                {hasContracts && <Card title='合约信息'
                    style={{ float:'left'}}>  
                      <div>合约地址 {productContracts[0].ContractAddress}</div>                    
                      <div>合约状态 {productContracts[0].Status}</div>   
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
                <div style = {{display:'none'}}>{chainId}</div>
            </Col>
        </Row>
        {nftOrders && nftOrders.length > 0 && <Row>
          <Card>{nftOrders.length}</Card>
        </Row>}
        {sales && sales.length && <Card title="销售">{sales.length}</Card>}
        <Modal
          visible={visible}
          title="创建NFT合约"
          onOk={this.handleSale}
          onCancel={this.handleSellCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleSellCancel}>取消</Button>,
            <Button disabled={!salesEnabled} key="submit" type="primary" size="large" loading={loading} onClick={this.handleSale}>
              创建
            </Button>,
          ]}
        >
          {
            !hasAccounts && <div>
              您尚未连接到钱包，请点击右上角钱包按钮选择连接的钱包
            </div>
          }
          {
            hasAccounts && !hasContracts && 
              <div>
                 <span>您尚未为您的作品在区块链中创建NFT合约</span>
                  <Button type="primary" onClick={this.handleCreateContract} size="large">创建合约</Button>
              </div>
          }
          

                <Form layout='vertical'
                >
                  <Form.Item label="Price">
                    
                  <Input.Group compact>
                  {getFieldDecorator('chainCode', {
                    initialValue: 'ETH',
                    rules: [
                      { required: true, message: '请选择合约' },
                    ],
                    })(<Select disabled={!salesEnabled} defaultValue="1">
                        <Option value="1">ETH</Option>
                      </Select>)}
                      {getFieldDecorator('price', {
                        initialValue: 0,
                        rules: [
                          { required: true, message: '请输入NFT价格' },
                        ],
                        })(<InputNumber 
                                disabled={!salesEnabled}
                                min={1} 
                                max={1000} 
                                step={0.00001} 
                                defaultValue={0} 
                                style={{ width: 300, textAlign: 'center' }} />)}
                                        
                    </Input.Group>
                  </Form.Item>
                  {getFieldDecorator('chainId', { initialValue: chainId })}
                  <Form.Item label="Duration">
                      {getFieldDecorator('saleTimeRange', { initialValue: [
                        moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')
                      ] })
                      (<RangePicker
                      disabled={!salesEnabled}
                      ranges={{
                          Today: [moment(), moment()],
                          'This Month': [moment().startOf('month'), moment().endOf('month')],
                      }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                      />)}
                  </Form.Item>
                  {contract && <Card>{contract.address}</Card>}
                </Form>
        </Modal>
        </div>
    );
  }
}

export default MyProductDetails;
