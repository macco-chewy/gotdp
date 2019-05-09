import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function CharacterHead(props) {

  const { character, onClick, className } = props;
  if (!character) {
    return null;
  }

  const handleClick = () => {
    onClick(character.name);
  }

  let rootClassNames = styles.root;
  switch (character.attributes.status) {
    case '1': // alive
      rootClassNames = classnames(rootClassNames, styles.alive);
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

  if (className) {
    rootClassNames = classnames(rootClassNames, className);
  }

  return (
    <div className={rootClassNames} onClick={handleClick}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic} style={(character.attributes.imageUrl) ? { backgroundImage: `url(${character.attributes.imageUrl})` } : {}} />
      </div>
    </div>
  );
}
