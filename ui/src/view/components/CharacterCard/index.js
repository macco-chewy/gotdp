import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function CharacterCard(props) {

  const { character, users, active, onClick } = props;
  if (!character) {
    return null;
  }

  const handleClick = () => {
    onClick(character.id);
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

  if (active) {
    rootClassNames = classnames(rootClassNames, styles.active);
  }

  let liveCount, deadCount, wightCount;
  liveCount = deadCount = wightCount = [];

  for (const name in users) {
    const user = users[name];
    const bid = parseInt(user.attributes.bids[character.id], 10);
    switch (bid) {
      case 1:
        liveCount.push(name);
        break;
      case 2:
        deadCount.push(name);
        break;
      case 3:
        wightCount.push(name);
        break;
      default:
        break;
    }
  }

  return (
    <div className={rootClassNames} onClick={handleClick}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic} style={{ backgroundImage: `url(${character.attributes.imageUrl})` }} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.name}><h2>{character.attributes.displayName || character.attributes.name}</h2></div>
        <div className={styles.details}>
          <div className={styles.characterPanel}>
            <div className={styles.quote}><pre>{character.attributes.quote}</pre></div>
            <div className={styles.summary}>{character.attributes.summary}</div>
            <div><a href={character.attributes.sourceUrl} target="new">Read more</a></div>
          </div>
          <div className={styles.userPanel}>
            <table>
              <tbody>
                <tr>
                  <th colSpan="2" style={{ background: '#333333', color: 'var(--off-white)', textAlign: 'center' }}>Bids</th>
                </tr>
                {
                  Object.keys(users).map((name, i) => {
                    const user = users[name];
                    const bid = user.attributes.bids[character.id];
                    if (!bid) {
                      return null;
                    }
                    return (
                      <tr key={i}>
                        <th>{name}</th>
                        <td className={styles[`status${bid}`]}>&bull;</td>
                      </tr>
                    )
                  })

                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
