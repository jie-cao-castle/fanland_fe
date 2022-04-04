import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { ChartCard, Field, MiniArea, MiniBar, MiniProgress } from '@/components/Charts';
import CountDown from '@/components/CountDown';
import { Paper } from '@mui/material';
import numeral from 'numeral';
import { BigNumber } from "bignumber.js";
import NumberInfo from '@/components/NumberInfo';
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
  Divider,
} from 'antd';
const { Panel } = Collapse;
import moment from 'moment';
const { Meta } = Card;
import { Form, Carousel, message } from 'antd';
import { getTimeDistance, getPageQuery } from '@/utils/utils';
import styles from './ProductDetails.less';
import {
  chainCurrencyMap,
} from '../../assets/constants.json'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUICollapse from '@mui/material/Collapse';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HubIcon from '@mui/icons-material/Hub';
import Avatar from '@mui/material/Avatar';
import MUICard from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
const { TabPane } = Tabs;
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
  trendingProducts:product.trendingProducts,
  usdPrice: eth.usdPrice,
}))
@Form.create()
class ProductDetails extends Component {
    state = {
        imageUrl:{},
        loading: false,
        visible: false,
        nftOrders: [],
        expanded:false,
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
          if (response.success && response.result && response.result.length > 0) {
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

      dispatch({
        type: 'product/fetchTrendingProducts',
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
                status: 0
              }
            });
          }
        }
      });
    });
  };

  handleBuy = (topSale) => {
    const { dispatch, productContracts, currentUser} = this.props;
    const ethPrice = BigNumber(topSale.Price).dividedBy(BigNumber(topSale.PriceUnit)).toFixed();
    dispatch({
      type: 'product/buyNft',
      payload: {
        tokenId: topSale.TokenId,
        price: ethPrice,
        contractAddress: productContracts[0].ContractAddress,
      },
      callback: (response) => {
        if (response && response.hash) {
          dispatch({
            type: 'product/createNftOrder',
            payload: {
              transactionHash:response.hash,
              ProductId:topSale.ProductId,
              nftKey:topSale.TokenId.toString(),
              price:topSale.Price,
              priceUnit:topSale.PriceUnit,
              amount:1,
              status:0,
              chainId:topSale.ChainId,
              chainCode:topSale.ChainCode,
              toUserId:currentUser.Id
            }
          });
        }
      }
    });
  }

  handleExpandClick = () => {
    const {expanded} = this.state;
    this.setState({ expanded: !expanded });
  }

  handleSale = (e) => {
    const { dispatch, productData,chainId, productContracts, currentUser } = this.props;
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
                  productId: productData.Id,
                  chainId :  chainId,
                  chainCode:"ETH",
                  contractId: productContracts[0].Id,
                  price:values.price * 1000000000,
                  priceUnit: 1000000000,
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

  handleBuySale(e, record) {
    console.log(record);
    e.preventDefault();
    const { dispatch, productContracts, currentUser } = this.props;
    const ethPrice = BigNumber(record.Price).dividedBy(BigNumber(record.PriceUnit)).toFixed();
    dispatch({
      type: 'product/buyNft',
      payload: {
        tokenId:record.TokenId,
        price: ethPrice,
        contractAddress: productContracts[0].ContractAddress,
      },
      callback: (response) => {
        if (response && response.hash) {
          dispatch({
            type: 'product/createNftOrder',
            payload: {
              transactionHash:response.hash,
              ProductId:productContracts[0].ProductId,
              nftKey:record.TokenId.ToString(),
              price:record.Price,
              priceUnit:1000000000,
              amount:1,
              status:0,
              chainId:productContracts[0].ChainId,
              chainCode:productContracts[0].ChainCode,
              toUserId:currentUser.Id
            }
          });
        }
      }
    });
  }


  formatCountDown = time => {
    const days = 24 * 60 * 60 * 1000;
    const hours = 60 * 60 * 1000;
    const minutes = 60 * 1000;
    const d = Math.floor(time / days);
    const h = Math.floor((time - d * days) / hours);
    const m = Math.floor((time - d * days - h * hours) / minutes);
    const s = Math.floor((time - d * days - h * hours - m * minutes) / 1000);
    return (
      <span>
          {d !=0 ? d +`天`+ this.fixedZero(h)+`小时` + this.fixedZero(m)+`分` + this.fixedZero(s)+`秒` 
            : this.fixedZero(h)+`小时` + this.fixedZero(m)+`分` + this.fixedZero(s)+`秒`}
      </span>
    );
  };

  fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
  }
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
  
  render() {
    const { productData, sales, contract, accounts, chainId, productContracts, trendingProducts, usdPrice } = this.props;
    const hasAccounts = accounts && accounts.length > 0;
    const hasContracts = productContracts && productContracts.length > 0;
    const salesEnabled = hasAccounts && hasContracts;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, loading, nftOrders, expanded } = this.state;

    
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


    let visitData = [];
    if (sales && sales.length > 0) {
      for (let i = sales.length - 1; i >=0; i -= 1) {
        visitData.push({
          x: moment(sales[i].EndTime).format('YYYY-MM-DD'),
          y: BigNumber(sales[i].Price).dividedBy(BigNumber(sales[i].PriceUnit)),
        });
      }
   }

   let topSalePriceInfo = undefined;
   let topSale = undefined;
   let targetTime = undefined;
   if (sales && sales.length > 0) {
      topSalePriceInfo  = BigNumber(sales[0].Price).dividedBy(BigNumber(sales[0].PriceUnit)) * usdPrice;
      targetTime = moment(sales[0].EndTime).valueOf();
      topSale = sales[0];
      console.log(sales[0]);
    }
    return (
        <div>
        <Row>
            <Col span={6} offset={3}>
                 {productData && productData.Creator && 
                <MUICard>
                <CardHeader
                  avatar={
                    <Avatar src={productData.Creator.AvatarUrl} aria-label="recipe">
                      R
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={productData.Creator.UserName}
                  subheader={moment(productData).format('YYYY-MM-DD')}
                />
                <CardMedia
                  component="img"
                  image={productData.ImgUrl}
                  alt="Paella dish"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                  <div>
                    <Tag color="#f50">每日精选</Tag>
                    <Tag color="#2db7f5">周热门</Tag>
                    <Tag color="#87d068">经典永流传系列</Tag>
                    <Tag color="#108ee9">永远买不到</Tag>
                  </div>
                  <Divider dashed style={{ margin: '16px 0' }} />
                  <div>
                    <Tag color="pink">中国风</Tag>
                    <Tag color="red">伊吹五月</Tag>
                    <Tag color="orange">美爆了</Tag>
                    <Tag color="green">天涯十美</Tag>
                    <Tag color="cyan">舞动中国</Tag>
                    <Tag color="blue">国风</Tag>
                    <Tag color="purple">水墨风</Tag>
                  </div>
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expanded}
                    onClick={this.handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <MUICollapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                      Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                      aside for 10 minutes.
                    </Typography>
                    <Typography paragraph>
                      Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                      medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                      occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
                      large plate and set aside, leaving chicken and chorizo in the pan. Add
                      pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
                      stirring often until thickened and fragrant, about 10 minutes. Add
                      saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                    </Typography>
                    <Typography paragraph>
                      Add rice and stir very gently to distribute. Top with artichokes and
                      peppers, and cook without stirring, until most of the liquid is absorbed,
                      15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
                      mussels, tucking them down into the rice, and cook again without
                      stirring, until mussels have opened and rice is just tender, 5 to 7
                      minutes more. (Discard any mussels that don’t open.)
                    </Typography>
                    <Typography>
                      Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                  </CardContent>
                </MUICollapse>
              </MUICard>
                }
                  {productData && productData.Desc &&<div>
                  <Accordion style={{marginTop:'10px'}}>
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                          malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                      </AccordionDetails>
                  </Accordion>}
                  </div>}
              </Col>

              {productData && productData.Name &&<Col div style={{ marginLeft: '20px'}} span={8}>
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

              {sales && sales.length > 0 && <Accordion expanded={true}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography>限时售价</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CountDown style={{ fontSize: 30 }} target={targetTime} format={this.formatCountDown}/>
                      <Button style={ {marginLeft: '35px', marginTop: '-10px' }} type="primary" icon="tag" size='large' onClick={() => this.handleBuy(topSale)}>下单</Button>
                      {usdPrice && <NumberInfo
                        subTitle={<span>历史价格</span>}
                        total={numeral(sales[0].Price*12321).format('0,0')}
                        status="up"
                        subTotal={17.1}
                      />}
                      <MiniArea line height={45} data={visitData} />
                    </AccordionDetails>
                  </Accordion>}

              <Accordion expanded={true}>
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography>售卖信息</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table locale={{ emptyText: '暂时没有售卖信息' }} columns={this.salsColumns} dataSource={sales} />
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
                      <Table locale={{ emptyText: '暂时没有交易信息' }} columns={this.orderColumns} dataSource={nftOrders} />
                      </AccordionDetails>
                  </Accordion>
            </Col>}
        </Row>
        {trendingProducts && trendingProducts.length >= 12 && <div className={styles.crsl}>
            <div
              className={styles.hotTxt}>
                更多的热门数字藏品
            </div>
            <Carousel autoplay>
              <div>
                <Row>
                {carouselTab1Data.map(item => (
                  <Col span={4} offset={1}>
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
                  </Col>
                ))}
                </Row>
              </div>
              <div>
                  {carouselTab2Data.map(item => (
                      <Col span={4} offset={1}>
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
                      </Col>
                    ))}
              </div>
              <div>
                  {carouselTab3Data.map(item => (
                          <Col span={4} offset={1}>
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
                          </Col>
                        ))}
              </div>
            </Carousel>
        </div>}
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

export default ProductDetails;
