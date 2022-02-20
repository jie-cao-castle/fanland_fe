import React, { PureComponent } from 'react';
import Link from 'umi/link';
import {
    Col,
    Row,
    Avatar,
  } from 'antd';
export default class NumberedListItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { avatar, number} = this.props;
    return (
      <div>
        <div>{number}</div>
        <Avatar src={avatar} />
      </div>
    );
  }
}
