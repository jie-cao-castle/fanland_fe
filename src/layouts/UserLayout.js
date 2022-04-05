import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { GiAbstract065 } from 'react-icons/gi';
const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

class UserLayout extends React.PureComponent {
  state = {
    backgroundImageIndex: 2,
  };
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  componentDidMount() {
    this.refreshBackgroundImage();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refreshBackgroundImage = () => {
    this.interval = setInterval(() => {
      let newbackgroundImageIndex = Math.floor(Math.random() * 5) + 1;
      console.log("newbackgroundImageIndex", newbackgroundImageIndex);
      this.setState({ backgroundImageIndex: newbackgroundImageIndex});
    }, 10000);
  };

  render() {
    const { children } = this.props;
    const { backgroundImageIndex } = this.state;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container} style={{backgroundImage:`url("/upload/`+ backgroundImageIndex.toString() + `.jpg")`}}> 
        <div className={styles.content}>
          {children}
        </div>
        <GlobalFooter
          links={[
            {
              key: '首页',
              title: '首页',
              href: '/',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <Icon type="github" />,
              href: '/',
              blankTarget: true,
            },
            {
              key: 'FanLand',
              title: 'FanLand',
              href: '/',
              blankTarget: true,
            },
          ]}
          copyright={
            <Fragment>
              Copyright <Icon type="copyright" /> 2022 繁澜宇宙出品
            </Fragment>
          }
        />
      </div>
    );
  }
}

export default UserLayout;
