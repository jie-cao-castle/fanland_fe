import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { GiAbstract065 } from 'react-icons/gi';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
        <GiAbstract065 size={32} />
        </Link>
        <div width="32" className={styles.cmpName}>Fanland</div>
        <RightContent {...this.props} />
      </div>
    );
  }
}
