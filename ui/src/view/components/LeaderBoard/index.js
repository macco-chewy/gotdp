import React from 'react';
import classnames from 'classnames';

import Panel from 'view/components/Panel';

import styles from './styles.module.css';

export default function LeaderBoard(props) {

  const { characters, users, className } = props;
  if (!characters || !users) {
    return null;
  }

  // sort users by score
  const compare = (a, b) => {
    if (a.attributes.score > b.attributes.score) return -1;
    if (b.attributes.score > a.attributes.score) return 1;
    return 0;
  }
  users.sort(compare);

  const [ first, second, third ] = users;

  // 3 way tie - show 3rd place style
  if (first.attributes.score === third.attributes.score) {
    first.status = second.status = third.status = styles.third;

    // tie first and second - show 2nd and 3rd place style
  } else if (first.attributes.score === second.attributes.score) {
    first.status = second.status = styles.second;
    third.status = styles.third;

    // tie second and third - show 1st and 3rd place style
  } else if (second.attributes.score === third.attributes.score) {
    first.status = styles.first;
    second.status = third.status = styles.third;

  }

  let rootClassName = classnames(styles.root, className);

  return (
    <Panel header="Leader Board" className={rootClassName}>
      <table>
        <tbody>
          {
            users.map((user, i) => {
              let rowClassName;
              switch (i) {
                case 0:
                  rowClassName = user.style || styles.first;
                  break;
                case 1:
                  rowClassName = user.style || styles.second;
                  break;
                case 2:
                  rowClassName = user.style || styles.third;
                  break;
                default:
                  rowClassName = '';
                  break;
              }
              return (
                <tr key={i} className={rowClassName}>
                  <th>{user.name}</th>
                  <td>{user.attributes.score || 0}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </Panel>
  );
}
