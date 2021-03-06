import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Card, Button, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { AiOutlineWallet, AiOutlineUser } from "react-icons/ai";

import MetaMaskOnboarding from '@metamask/onboarding';
const { isMetaMaskInstalled } = MetaMaskOnboarding;

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
let onboarding;
try {
  onboarding = new MetaMaskOnboarding({ forwarderOrigin });
} catch (error) {
  console.error(error);
}

export default 
@connect(({ eth }) => ({
  accounts: eth.accounts,
}))
class GlobalHeaderRight extends PureComponent {
  state = {
    loading: false,
    visible: false,
  };

  isMetaMaskConnected = () => {
    const { accounts } = this.props;
    return accounts && accounts.length > 0;
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  handleWalletClick = async () => {
    try {
      if (isMetaMaskInstalled())  {
        if (this.isMetaMaskConnected()) {
          if (onboarding) {
            onboarding.stopOnboarding();
          }
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'eth/fetchAccounts',
          });
          const { currentEth } = this.props;
          console.log(currentEth)
        }   
      } else {
        this.showModal();        
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleInstall = () => {
    onboarding.startOnboarding();
  };
  
  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      accounts
    } = this.props;
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href="/user/login">
            登录
          </a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="/reigster">
            注册
          </a>
        </Menu.Item>
      </Menu>
    );
    const { visible, loading } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
            个人中心
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
            账号设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    
    return (
        <div className={className}>
            <HeaderSearch
              className={`${styles.action} ${styles.search}`}
              placeholder="Search in Fanland"
              dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
              onSearch={value => {
                console.log('input', value); // eslint-disable-line
              }}
              defaultOpen = {true}
              onPressEnter={value => {
                console.log('enter', value); // eslint-disable-line
              }}
            />
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ display: 'inline-block'}}
              >
              <Menu.Item key="1">探索</Menu.Item>
              <Menu.Item key="2">创造</Menu.Item>
            </Menu>

              <NoticeIcon
              className={styles.action}
              count={currentUser.notifyCount}
              onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
              }}
              onClear={onNoticeClear}
              onPopupVisibleChange={onNoticeVisibleChange}
              loading={fetchingNotices}
              popupAlign={{ offset: [20, -16] }}
            >
              <NoticeIcon.Tab
                list={noticeData['通知']}
                title="通知"
                emptyText="你已查看所有通知"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
              />
              <NoticeIcon.Tab
                list={noticeData['消息']}
                title="消息"
                emptyText="您已读完所有消息"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              />
              <NoticeIcon.Tab
                list={noticeData['待办']}
                title="待办"
                emptyText="你已完成所有待办"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
              />
            </NoticeIcon>
            {currentUser && currentUser.UserName ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={currentUser.AvatarUrl}
                    alt="avatar"
                  />
                  <span className={styles.name}>{currentUser.UserName}</span>
                </span>
              </Dropdown>
            ) : (
              <Dropdown overlay={itemMenu}>
              <AiOutlineUser
                  className = {styles.wltBtn}
                   size={25} 
              />
              </Dropdown>
            )}
      
              <AiOutlineWallet
                  className = {styles.wltBtn}
                  onClick={() => {
                  this.handleWalletClick();
                }} 
                size={25} 
              />
            <Modal
              visible={visible}
              title="选择一个钱包来连接"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                  连接
                </Button>,
              ]}
            >
            </Modal>     
        </div>
    );
  }
}
