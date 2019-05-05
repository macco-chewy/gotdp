import React from 'react';
import classnames from 'classnames';

import Panel from 'view/components/Panel';

import styles from './styles.module.css';

export default function CharacterCard(props) {

  const { character, users, active, onClick, className } = props;
  if (!character) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(character.id);
    }
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

  if (active) {
    rootClassNames = classnames(rootClassNames, styles.active);
  }

  rootClassNames = classnames(rootClassNames, className);

  let liveCount, deadCount, wightCount;
  liveCount = deadCount = wightCount = 0;

  for (const name in users) {
    const user = users[name];
    const bid = parseInt(user.attributes.bids[character.id], 10);
    switch (bid) {
      case 1:
        liveCount++;
        break;
      case 2:
        deadCount++;
        break;
      case 3:
        wightCount++;
        break;
      default:
        break;
    }
  }

  return (
    <div className={rootClassNames} onClick={handleClick}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic} style={(character.attributes.imageUrl) ? { backgroundImage: `url(${character.attributes.imageUrl})` } : {}} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.name}>
          <h2>{character.attributes.displayName || character.attributes.name}</h2>

          <div className={styles.stats}>
            <table>
              <tbody>
                <tr>
                  <td className={styles.status1}>{liveCount}</td>
                  <td className={styles.status2}>{deadCount}</td>
                  <td className={styles.status3}>{wightCount}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div className={styles.details}>
          <div className={styles.characterPanel}>
            <div className={styles.quote}>{
              character.attributes.quote.split('\n').map((line, i) => {
                return (
                  <p key={i}>{line}</p>
                )
              })
            }</div>
            <div className={styles.summary}>{character.attributes.summary}</div>
            <div><a href={character.attributes.sourceUrl} target="_blank" rel="noopener noreferrer">Read more</a></div>
          </div>

          <Panel header="Bids" className={styles.bidPanel} headerClassName={styles.bidPanelHeader} bodyClassName={styles.bidPanelBody} footerClassName={styles.bidPanelFooter}>
            <table>
              <tbody>
                {
                  users.map((user, i) => {
                    const bid = user.attributes.bids[character.id];
                    if (!bid) {
                      return null;
                    }
                    return (
                      <tr key={i}>
                        <th>{user.name}</th>
                        <td className={styles[`status${bid}`]}>&nbsp;</td>
                      </tr>
                    )
                  })

                }
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  );
}
