import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function Panel(props) {
  const { header, footer, className, headerClassName, bodyClassName, footerClassName } = props;

  return (
    <div className={classnames(styles.root, className)}>
      <div className={classnames(styles.header, headerClassName)}>{header || '&nbsp;'}</div>
      <div className={classnames(styles.body, bodyClassName)}>{props.children}</div>
      <div className={classnames(styles.footer, footerClassName)}>{footer}</div>
    </div>
  );
}




