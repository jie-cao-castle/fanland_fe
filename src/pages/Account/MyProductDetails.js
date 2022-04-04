import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {
  Card,
  Tag,
  DatePicker,
  Input,
  Collapse,
  Button,
  Modal,
  Row,
  Col,
  Select,
  InputNumber,
  Table,
  Tabs,
} from 'antd';
import moment from 'moment';
const { Meta } = Card;
import { Form, Upload, Icon, message } from 'antd';
import { getTimeDistance, getPageQuery } from '@/utils/utils';
import styles from './MyProductDetails.less';
import {
  chainCurrencyMap,
} from '../../assets/constants.json'
import { Paper } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HubIcon from '@mui/icons-material/Hub';
import { BigNumber } from "bignumber.js";
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
  productData: product.productData,
  sales: product.sales,
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
        productSales:[],
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

  salsColumns = [
    {
      title: '价格',
      dataIndex: 'Price',
      key: 'price',
      render: (text, record) => {
          return (
          <span>
            {BigNumber(record.Price).dividedBy(BigNumber(record.PriceUnit)).toFixed()}
          </span>
          );
        }
    },
    {
      title: 'Token类型',
      dataIndex: 'ChainCode',
      key: 'hainCode',
    },
    {
      title: '截止日期',
      dataIndex: 'EndTime',
      key: 'endTime',
      render: (text, record) => {
          return (
            <span>
            {moment(record.EndTime).format('YYYY-MM-DD')}
          </span>
          );
        }
    },
    {
      title: '售卖方',
      dataIndex: 'FromUserId',
      key: 'fromUser',
      render: (text, record) => {
        return (
          <span>
            <a href="#">{record.FromUserName}</a>      
          </span>
        );
      }
    },
    {
      title: '交易信息',
      key: 'status',
      dataIndex: 'Status',
      render: (text, record) => {
        let color = 'geekblue';
        let txt = "提交中";
        if (record.Status == 1) {
          color = 'green';
          txt = "售卖中"
        } else if (record.Status == 2) {
          color = 'volcano'
          txt = "已截止"
        }
          return (
            <Tag color={color} key={record.Id}>
            {txt}
          </Tag>
          );
        }
      },
      {
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => {
          let color = 'geekblue';
          let txt = "提交中";
          if (record.Status == 1) {
            color = 'green';
            txt = "售卖中"
          } else if (record.Status == 2) {
            color = 'volcano'
            txt = "已截止"
          }
            return (
            <span>
            {record.Status == 1 &&
              <span>
                <Button type='primary' onChange={e => this.handleBuySale(e, record)}>
                  购买
                </Button>
              </span>
              }
              {(record.Status == 2 || record.Status == 0)&&
              <span>
                <Button>
                  查看
                </Button>
              </span>
              }
            </span>
            );
          }
        }
  ];

  orderColumns = [
    {
      title: '数字藏品ID',
      dataIndex: 'NftKey',
      key: 'nftKey',
    },
    {
      title: '成交价格',
      dataIndex: 'Price',
      key: 'price',
      render: (text, record) => {
          return (
          <span>
            {BigNumber(record.Price).dividedBy(BigNumber(record.PriceUnit)).toFixed()}
          </span>
          );
        }
    },
    {
      title: 'Token类型',
      dataIndex: 'ChainCode',
      key: 'hainCode',
    },
    {
      title: '成交日期',
      dataIndex: 'UpdateTime',
      key: 'transactionTime',
      render: (text, record) => {
          return (
            <span>
            {moment(record.UpdateTime).format('YYYY-MM-DD')}
          </span>
          );
        }
    },
    {
      title: '购买者',
      dataIndex: 'ToUserId',
      key: 'toUser',
      render: (text, record) => {
        return (
          <span>
            <a href="#">{record.ToUserName}</a>      
          </span>
        );
      }
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'Status',
      render: (text, record) => {
        let color = 'geekblue';
        let txt = "区块链确认中";
        if (record.Status == 1) {
          color = 'green';
          txt = "已完成"
        }
        return (
          <Tag color={color} key={record.Id}>
            {txt}
          </Tag>
          );
        }
      }
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
        callback: (response) => {
          console.log("product/fetch", response)
          if (response.success) {
            const salesData = response.result.sales;
            console.log("product/fetch salesData", salesData);
            if (salesData && salesData.length > 0) {
              for (let i = 0; i < salesData.length; i++) {
                const sale = salesData[i];
                if (sale.Status == 0) {
                  dispatch({
                    type: 'product/updateSale',
                    payload: {
                      id: sale.Id,
                      status: 1
                    },
                  });
                }
              }
            }
          }
        }
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

  handleSale = (e) => {
    const { dispatch, productData, chainId, productContracts, currentUser } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        dispatch({
          type: 'product/setPrice',
          payload: {
            contractAddress: productContracts[0].ContractAddress,
            price: values.price,
            tokenId: productContracts[0].NextTokenId,
          },
          callback: (response) => {
            if (response && response.hash) {
              console.log("setPrice", response)
              dispatch({
                type: 'product/createSale',
                payload: {
                  productId: productData.product.Id,
                  chainId :  chainId,
                  chainCode:"ETH",
                  contractId: productContracts[0].Id,
                  price: values.price * 1000000000,
                  priceUnit: 1000000000,
                  startTime: values.saleTimeRange[0].format(),
                  endTime:values.saleTimeRange[1].format(),
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
    const { productData, sales, contract, accounts, chainId, productContracts } = this.props;
    console.log(chainId)

    console.log(sales);

    const hasAccounts = accounts && accounts.length > 0;
    const hasContracts = productContracts && productContracts.length > 0;
    const salesEnabled = hasAccounts && hasContracts;

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, loading, nftOrders, productSales } = this.state;
    
    return (
      
        <div>
           <Row>
            <Col span={6} offset={3}>
                 {productData && productData.Creator && 
                 <Paper square={true}>
                    <img
                        className={styles.prodImg}
                        alt="example"
                        src={productData.ImgUrl}
                    />
                </Paper>
                }
                  {productData && productData.Desc &&<div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>作品描述</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{productData.Desc}</Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>{`关于作者 - ` + productData.Creator.UserName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{productData.Creator.UserDesc}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  {hasContracts && <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography>NFT合约信息</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        <div>合约地址 {productContracts[0].ContractAddress}</div>                    
                        <div>合约状态 {productContracts[0].Status}</div>   
                        </Typography>
                      </AccordionDetails>
                  </Accordion>}
                  </div>}
              </Col>
              {productData && productData.Name &&<Col div style={{ marginLeft: '20px'}} span={7}>
              <div>
                <div className={styles.prodTtl}>{productData.Name}</div>
                  <Stack style={{width: '100%'}} direction="row" spacing={1.5}>
                    <Stack direction="row" spacing={1}>
                      <PeopleAltIcon color="action" />
                      <Typography>5人拥有这个藏品</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                    <HubIcon color="action" />
                    <Typography>6个独立藏品</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <FavoriteIcon color="action" />
                       <Typography>18人喜欢该作品</Typography>
                    </Stack>
                  </Stack>
              </div>
              <Stack direction="row" style={{marginTop: '10px'}} spacing={1}>
                <Button  icon="edit" size='large'>编辑</Button>
                <Button type="primary" icon="tag" size='large' onClick={this.showModal}>售卖</Button>
              </Stack>
              <Accordion expanded={true}>
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography>售卖信息</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table locale={{ emptyText: '没数据' }} columns={this.salsColumns} dataSource={sales} />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion style={{marginTop: '15px'}} expanded={true}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>交易记录</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                      <Table columns={this.orderColumns} dataSource={nftOrders} />
                      </AccordionDetails>
                  </Accordion>
            </Col>}
        </Row>
        <Modal
          visible={visible}
          title="销售你的NFT"
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
                                min={0.01} 
                                max={1000} 
                                step={0.00001} 
                                defaultValue={0} 
                                style={{ width: 300, textAlign: 'center' }} />)}
                                        
                    </Input.Group>
                  </Form.Item>
                  {getFieldDecorator('chainId', { initialValue: chainId })}
                  <Form.Item label="Duration">
                      {getFieldDecorator('saleTimeRange', { initialValue: [
                        moment(), moment().add(7, 'days')
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
