import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function LeaderBoard(props) {

  const { users, className, onClick } = props;
  if (!users) {
    return null;
  }

  const handleClick = (name) => {
    if (onClick) {
      onClick(name);
    }
  }

  // filter out any ignored users
  const scoredUsers = users.filter(user => {
    return !user.attributes.ignore;
  });

  const ignoredUsers = users.filter(user => {
    return user.attributes.ignore;
  });

  // sort users by score
  const compare = (a, b) => {
    if (a.attributes.score > b.attributes.score) return -1;
    if (b.attributes.score > a.attributes.score) return 1;
    return 0;
  }
  scoredUsers.sort(compare);

  // // check for ties
  // const [first, second, third] = scoredUsers;
  // // 3 way tie - show 3rd place style
  // if (first.attributes.score === third.attributes.score) {
  //   first.status = second.status = third.status = styles.third;
  //   // tie first and second - show 2nd and 3rd place style
  // } else if (first.attributes.score === second.attributes.score) {
  //   first.status = second.status = styles.second;
  //   third.status = styles.third;
  //   // tie second and third - show 1st and 3rd place style
  // } else if (second.attributes.score === third.attributes.score) {
  //   first.status = styles.first;
  //   second.status = third.status = styles.third;
  // }

  let placements = 0;
  scoredUsers.map((user, i) => {
    if (placements <= i) {

      // if there are still leader slots
      if (placements < 3) {
        // get current user score
        const score = user.attributes.score;

        // find all users with same score
        const sameScores = [user];
        let x = i + 1;
        while (x < scoredUsers.length) {
          const nextUser = scoredUsers[x];
          const nextScore = nextUser.attributes.score;
          if (nextScore !== score) {
            break;
          }
          sameScores.push(nextUser);
          x++;
        }

        if (placements === 0) {
          if (sameScores.length === 1) {
            sameScores.map(user => user.style = styles.first);
          } else if (sameScores.length === 2) {
            sameScores.map(user => user.style = styles.second);
          } else {
            sameScores.map(user => user.style = styles.third);
          }

        } else if (placements === 1) {
          if (sameScores.length === 1) {
            sameScores.map(user => user.style = styles.second);
          } else {
            sameScores.map(user => user.style = styles.third);
          }
        } else {
          sameScores.map(user => user.style = styles.third);
        }

        placements += sameScores.length;

        // just assign last
      } else {
        user.style = styles.last;
      }
    }
    return user;
  });

  let rootClassName = classnames(styles.root, className);

  return (
    <div className={rootClassName}>
      {
        scoredUsers.map((user, i) => {
          return (
            <div key={i} className={classnames(styles.bidderContainer, user.style)} onClick={() => handleClick(user.name)}>
              <div className={styles.bidderName}>{user.name}</div>
              <div className={styles.bidderScore}>{user.attributes.score}</div>
            </div>
          )
        })
      }
      {
        ignoredUsers.map((user, i) => {
          return (
            <div key={i} className={classnames(styles.bidderContainer, styles.last)} onClick={() => handleClick(user.name)}>
              <div className={styles.bidderName}>*{user.name}</div>
              <div className={styles.bidderScore}>{user.attributes.score}</div>
            </div>
          )
        })
      }
    </div>
  );
}
