import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function Panel(props) {
  const { header, className } = props;

  let rootClassName = classnames(styles.root, className);

  return (
    <div className={rootClassName}>
      <div className={styles.header}>{header || '&nbsp;'}</div>
      <div className={styles.container}>{props.children}</div>
    </div>
  );
}




