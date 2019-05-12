import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { get as getUser } from 'actions/user';

import PageHeader from 'view/components/PageHeader';

import styles from './styles.module.css';

const CHAR_POINTS = 5;
const QUES_POINTS = 10;


const CharacterFormRow = (props) => {

  const { character, status, bid, possiblePoints, actualPoints } = props

  const rowStyle = classnames(styles.formRow, styles[`status${status}`]);
  const itemClassNames = classnames(styles.formItem, styles.flex1);
  const possiblePointsClassNames = classnames(itemClassNames, styles.possiblePoints);
  const actualPointsClassNames = classnames(itemClassNames, styles.actualPoints, styles[`status${bid}`]);

  return (
    <div className={rowStyle}>
      <div className={styles.formItemLabel}>
        <h3>{character.attributes.displayName}</h3>
      </div>
      <div className={possiblePointsClassNames}>{possiblePoints}</div>
      <div className={actualPointsClassNames}>{actualPoints}</div>
    </div>
  );
}


const QuestionFormRow = (props) => {

  const { question, answer, bid, possiblePoints, actualPoints } = props

  const rowStyle = classnames(styles.formRow, (answer) ? styles.status1 : '');
  const itemClassNames = classnames(styles.formItem, styles.flex2);
  const correctAnswerClassNames = classnames(itemClassNames, styles.correctAnswer);
  const possiblePointsClassNames = classnames(itemClassNames, styles.possiblePoints);
  const actualPointsClassNames = classnames(itemClassNames, styles.actualPoints, (bid === answer) ? styles.status1 : (bid) ? styles.status2 : '');
  const actualAnswerClassNames = classnames(itemClassNames, styles.actualAnswer, (bid === answer) ? styles.status1 : (bid) ? styles.status2 : '');

  return (
    <div className={rowStyle}>
      <div className={styles.formItemLabel}>
        <h4>{question.attributes.text}</h4>
      </div>
      <div className={correctAnswerClassNames}>{answer}</div>
      <div className={possiblePointsClassNames}>{possiblePoints}</div>
      <div className={actualPointsClassNames}>{actualPoints}</div>
      <div className={actualAnswerClassNames}>{bid || 'no answer'}</div>
    </div>
  );
}







class BidderDetail extends Component {
  static propTypes = {
    characters: PropTypes.any,
    clearUser: PropTypes.func,
    getUser: PropTypes.func,
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    questions: PropTypes.any,
    push: PropTypes.func,
    user: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      totalPossiblePoints: 0,
      totalActualPoints: 0
    };
  }

  componentWillMount() {
    const { name, user, clearUser, getUser } = this.props;
    if (!user || user.name !== name) {
      clearUser();
      getUser(name, true);
    }
    this.refreshTotals();
  };


  componentDidUpdate() {
    this.refreshTotals();
  }


  refreshTotals = () => {
    const { characters, questions, user } = this.props;

    const totals = {
      totalPossiblePoints: 0,
      totalActualPoints: 0
    };

    characters.forEach(character => {
      const stats = this.calculateCharacterStats(character, user);
      totals.totalPossiblePoints += stats.possiblePoints;
      totals.totalActualPoints += stats.actualPoints;
    });

    questions.forEach(question => {
      const stats = this.calculateQuestionStats(question, user);
      totals.totalPossiblePoints += stats.possiblePoints;
      totals.totalActualPoints += stats.actualPoints;
    });

    const { totalPossiblePoints, totalActualPoints } = this.state;
    if (
      totals.totalPossiblePoints !== totalPossiblePoints
      || totals.totalActualPoints !== totalActualPoints
    ) {
      this.setState(totals);
    }
  }

  calculateCharacterStats = (character, user) => {
    const stats = {
      status: 0,
      bid: 0,
      possiblePoints: 0,
      actualPoints: 0
    };

    if (!character) {
      return stats;
    }

    stats.status = parseInt(character.attributes.status, 10);
    let possiblePoints = CHAR_POINTS;
    if (stats.status > 1) {
      possiblePoints += CHAR_POINTS;
    }
    stats.possiblePoints = possiblePoints;

    if (!user) {
      return stats;
    }

    stats.bid = parseInt(user.attributes.bids[character.id], 10) || 0;

    // did bidder guess alive or deceased
    // if bid is alive and equals status
    // or bid is not alive and status is not alive
    // grant points

    // console.log(stats.bid, stats.status, (stats.bid === 1 && stats.bid === stats.status), (stats.bid > 1 && stats.status > 1));

    if (
      (stats.bid === 1 && stats.bid === stats.status)
      || (stats.bid > 1 && stats.status > 1)
    ) {
      stats.actualPoints += CHAR_POINTS;
    }

    // did bidder guess wight or not
    // if bid is not alive
    // and status equals bid
    // grant points
    if (
      stats.bid > 1
      && stats.status === stats.bid
    ) {
      stats.actualPoints += CHAR_POINTS;
    }

    return stats;
  }

  calculateQuestionStats = (question, user) => {
    const stats = {
      answer: '',
      bid: '',
      possiblePoints: 0,
      actualPoints: 0
    }

    // if no question return
    // if no answer return
    if (!question || !question.attributes.correctAnswer) {
      return stats;
    }

    stats.answer = question.attributes.correctAnswer;
    switch (question.attributes.type) {
      case 'radio':
        stats.answer = question.attributes.answers.find(answer => {
          return answer.value === stats.answer;
        }).text;
        break;
      default:
        break;
    }
    stats.possiblePoints = QUES_POINTS

    // if no user return
    // if no user bid return
    if (!user || !user.attributes.questions[question.id]) {
      return stats;
    }

    stats.bid = user.attributes.questions[question.id];
    if (stats.bid === stats.answer) {
      stats.actualPoints = QUES_POINTS;
    }

    switch (question.attributes.type) {
      case 'radio':
        stats.bid = question.attributes.answers.find(answer => {
          return answer.value === stats.bid;
        }).text;
        break;
      default:
        break;
    }

    return stats;
  }

  render() {
    const { totalPossiblePoints, totalActualPoints } = this.state;
    const { characters, questions, user } = this.props;

    if (!user) {
      return null;
    }

    return (
      <div className={styles.root}>
        <PageHeader>Score Detail - {user.name}</PageHeader>
        <div className={styles.scoringDetails}>
          <p>The following is a break-down of how the scores are calculated:</p>
          <ul>
            <li>A correct bid on character status (<em>Alive</em> / <em>Deceased</em>) is worth <em>{CHAR_POINTS}</em> points.</li>
            <li>A correct bid on a character becoming a <em>Wight / White Walker</em> or not is worth an additional <em>{CHAR_POINTS}</em> points, but only if the character is deceased.</li>
            <li>Each correct bonus question is worth <em>{QUES_POINTS}</em> points.</li>
          </ul>
          <p>EXAMPLES:</p>
          <ul>
            <li><em>Character A</em> survives the series (somehow).  All bidders that chose <em>Alive</em> for <em>Character A</em> receive <em>{CHAR_POINTS}</em> points.</li>
            <li><em>Character B</em> predictably dies horribly in episode 6. All bidders that chose deceased receive <em>{CHAR_POINTS}</em> points and a lingering emtional scar, or giant sigh of relief when Cersei meets here innevitable end (no spoilers).</li>
            <li>Additionally, all bidders that guessed correctly that <em>Character B</em> would become a white walker get another <em>{CHAR_POINTS}</em> points.</li>
            <li>Finally, all bidders that correctly guessed Bran would lose the baby, regardless of whether or not they guessed he was pregnant in the first place, would receive a whopping <em>{QUES_POINTS}</em> points.</li>
          </ul>
          <p>The charts below illustrate the current point calculations.  The row colors indicate the current status of the character or question.  The point columns show the possible and actual point values, respectively.</p>
          <p>Any character or question without a status or answer is represented in black.  This may indicate that either the question is not yet answered or the bidder did not submit a bid.  IKR?</p>
        </div>

        <div className={styles.formRowSpacer}></div>

        <PageHeader>Totals</PageHeader>
        <div className={styles.formRow}>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreLabel)}>Total Possible:</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreValue)}>{totalPossiblePoints}</div>
        </div>
        <div className={styles.formRow}>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreLabel)}>Total Score:</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreValue)}>{totalActualPoints}</div>
        </div>

        <div className={styles.formRowSpacer}></div>

        <PageHeader legend="status">Character Bids</PageHeader>
        <div className={styles.formRow}>
          <div className={styles.formItemLabel}>Name</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.possiblePoints)}>Worth</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.actualPoints)}>Score</div>
        </div>
        {
          characters.length === 0
            ? null
            : characters.map((character, i) => {
              const stats = this.calculateCharacterStats(character, user);
              return <CharacterFormRow key={i} character={character} user={user} {...stats} />
            })
        }

        <div className={styles.formRowSpacer}></div>

        <PageHeader legend="questions">Bonus Questions</PageHeader>
        <div className={styles.formRow}>
          <div className={styles.formItemLabel}>Question</div>
          <div className={classnames(styles.formItem, styles.flex2, styles.correctAnswer)}>Answer</div>
          <div className={classnames(styles.formItem, styles.flex2, styles.possiblePoints)}>Worth</div>
          <div className={classnames(styles.formItem, styles.flex2, styles.actualPoints)}>Score</div>
          <div className={classnames(styles.formItem, styles.flex2, styles.actualAnswer)}>Bid</div>
        </div>
        {
          questions.length === 0
            ? null
            : questions.map((question, i) => {
              const stats = this.calculateQuestionStats(question, user);
              return <QuestionFormRow key={i} question={question} user={user} {...stats} />
            })
        }

        <div className={styles.formRowSpacer}></div>

        <PageHeader>Totals</PageHeader>
        <div className={styles.formRow}>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreLabel)}>Total Possible:</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreValue)}>{totalPossiblePoints}</div>
        </div>
        <div className={styles.formRow}>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreLabel)}>Total Score:</div>
          <div className={classnames(styles.formItem, styles.flex1, styles.scoreValue)}>{totalActualPoints}</div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  characters: state.characters,
  isLoading: state.global.isLoading,
  name: ownProps.match.params.name,
  questions: state.questions,
  user: state.user
});

const actions = {
  getUser: getUser.byName,
  clearUser: getUser.clear,
  push
};

export default connect(mapStateToProps, actions)(BidderDetail);
