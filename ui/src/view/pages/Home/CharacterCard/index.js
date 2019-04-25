import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';


export default function CharacterCard(props) {
  const { character } = props;
  if (!character) {
    return null;
  }

  let rootClassNames = styles.root;
  switch (character.attributes.status) {
    case '1': // alive
      break;
    case '2': // deceased
      rootClassNames = classnames(rootClassNames, styles.deceased);
      break;
    case '3': // wight
      rootClassNames = classnames(rootClassNames, styles.wight);
      break;
    default:
      break;
  }

  // rootClassNames = classnames(rootClassNames, styles.active);

  return (
    <div className={rootClassNames}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic} style={{ backgroundImage: `url(${character.attributes.imageUrl})` }} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.name}><h2>{character.attributes.name}</h2></div>
        <div className={styles.details}>asdf</div>
      </div>
    </div>
  );
}
