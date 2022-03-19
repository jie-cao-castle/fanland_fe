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

@connect(({ chart, loading, eth }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
  accounts: eth.accounts,
}))
@Form.create()
class ProductCreate extends Component {
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
    const { getFieldDecorator } = this.props.form;
    const props = {
        name: 'file',
        multiple: true,
        showUploadList: false,
        action: '//jsonplaceholder.typicode.com/posts/',
        onChange(info) {
          const status = info.file.status;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
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
        <Card title="上传你的作品" bordered={false}>
            <div style={{ marginTop: 16, height: 180 }}>
                <Dragger {...props}>
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
                    rules: [{
                      message: 'The input is not valid E-mail!',
                    }, {
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
                {getFieldDecorator('extraLink', {
                    rules: [{
                      message: 'The input is not valid E-mail!',
                    }, {
                    required: true, message: '请输入名称',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="描述"
                hasFeedback
                >
                {getFieldDecorator('desc', {
                    rules: [{
                      message: 'The input is not valid E-mail!',
                    }, {
                    required: true, message: '请输入名称',
                    }],
                })(
                    <TextArea rows={4} />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="作品集"
                hasFeedback
                >
                {getFieldDecorator('collection', {
                    rules: [{
                      message: 'The input is not valid E-mail!',
                    }, {
                    required: true, message: '请输入名称',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="数量"
                hasFeedback
                >
                {getFieldDecorator('number', {
                    rules: [{
                      message: 'The input is not valid E-mail!',
                    }, {
                    required: true, message: '请输入名称',
                    }],
                })(
                    <InputNumber min={1} max={10} defaultValue={3} />
                )}
                </FormItem>
                <FormItem
                   {...formItemLayout}
                    label="区块链"                    
                    >
                    {getFieldDecorator('blockChain', {
                        rules: [{ required: true, message: 'Please select your gender!' }],
                    })(
                        <Select
                        placeholder="Select a option and change input text above"
                        onChange={this.handleSelectChange}
                        >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        </Select>
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
