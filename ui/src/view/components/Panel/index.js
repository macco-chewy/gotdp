import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function Panel(props) {
  const { header, footer, className, innerClassName } = props;

  return (
    <div className={classnames(styles.root, className)}>
      <div className={styles.header}>{header || '&nbsp;'}</div>
      <div className={classnames(styles.container, innerClassName)}>{props.children}</div>
      <div className={styles.footer}>{footer}</div>
    </div>
  );
}




