import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {
  Card,
  Tabs,
  DatePicker,
  Input,
  Select,
  Button,
  InputNumber,
} from 'antd';

import { Form, Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;
const { TextArea } = Input;
import { getTimeDistance } from '@/utils/utils';

import styles from './ProductCreate.less';

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

@connect(({ user, loading, eth }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['chart/fetch'],
  accounts: eth.accounts,
}))
@Form.create()
class ProductCreate extends Component {
    state = {
        imageUrl:{},
        loading: false,
        fileList:[],
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

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'product/create',
          payload: values,
        });
      }
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

  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.success === true;
      }
      return true;
    });


    console.log(fileList);
    if (fileList && fileList.length > 0) {
      const { form } = this.props;
      console.log(fileList[0]);
      if (fileList[0].response) {
        form.setFieldsValue({
          imgUrl: fileList[0].response.result,
        });
      }
    }


    this.setState({ fileList });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props;
    const props = {
        name: 'file',
        listType: 'picture',
        className: 'upload-list-inline',
        action: '/api/v1/productsUpload/postContent',
        onChange: this.handleChange,
      };
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 14,
            offset: 6,
          },
        },
      };
      
      
    return (
        <Card title="上传你的作品作为数字藏品" bordered={false}>
            <div style={{ marginTop: 16, marginLeft:'auto', marginRight:'auto', width:'50%'}}>
                <Dragger {...props} fileList={this.state.fileList}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或者拖拽图像到这里进行上传</p>
                <p className="ant-upload-hint">支持大部分的图像和音频格式</p>
                </Dragger>
            </div>
            <Form onSubmit={this.handleSubmit}>
            <FormItem
                {...formItemLayout}
                label="名称"
                hasFeedback
                >
                {getFieldDecorator('name', {
                    rules: [
                    {
                        required: true, message: '请输入名称',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="外部链接"
                hasFeedback
                >
                {getFieldDecorator('externalUrl', {
                    rules: [{
                    message: '请外部链接',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                {getFieldDecorator('creatorId', {
                    initialValue: currentUser.Id,
                })}
                {getFieldDecorator('imgUrl', {
                    initialValue: undefined,
                })}
                <FormItem
                {...formItemLayout}
                label="描述"
                hasFeedback
                >
                {getFieldDecorator('productDesc', {
                    rules: [{
                    required: true, message: '请输入名称',
                    }],
                })(
                    <TextArea rows={4} />
                )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">创建</Button>
                </FormItem>
            </Form>
        </Card>

    );
  }
}

export default ProductCreate;
