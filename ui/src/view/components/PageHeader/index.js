import React from 'react';

import styles from './styles.module.css';

export default function Legend(props) {

  const { legend } = props;

  let textAlive, textDeceased, textWight;
  switch (legend) {
    case 'rank':
      textAlive = '1st';
      textDeceased = '2nd';
      textWight = '3rd';
      break;
    case 'questions':
      textAlive = 'Correct';
      textDeceased = 'Incorrect';
      textWight = '';
      break;
    case 'status':
      textAlive = 'Alive';
      textDeceased = 'Deceased';
      textWight = 'Wight';
      break;
    default:
      textAlive = '';
      textDeceased = '';
      textWight = '';
      break;
  }

  return (
    <div className={styles.root}>
      <div className={styles.pageHeader}>{props.children}</div>
      <div className={styles.legend}>

        {
          (!textAlive)
            ? null
            : <div className={styles.alive}>{textAlive}</div>
        }
        {
          (!textDeceased)
            ? null
            : <div className={styles.deceased}>{textDeceased}</div>
        }
        {
          (!textWight)
            ? null
            : <div className={styles.wight}>{textWight}</div>
        }

      </div>
    </div>
  );
}
