import React, { PureComponent } from 'react';
import Link from 'umi/link';
import {
    Avatar,
  } from 'antd';
export default class NumberedAvatar extends PureComponent {
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
