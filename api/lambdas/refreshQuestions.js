import {
  refreshQuestionByName
} from '../models/question';

const questions = [
  {
    name: 'question1',
    type: 'text',
    text: 'Who will sit the Iron Throne?'
  },
  {
    name: 'question2',
    type: 'radio',
    text: 'Is Daenerys Pregnant?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question3',
    type: 'radio',
    text: 'Will she lose the baby?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ],
    dependsOn: 'question2'
  },
  {
    name: 'question4',
    type: 'text',
    text: 'Who kills The Night King?'
  },
  {
    name: 'question5',
    type: 'radio',
    text: 'Will Nymeria make a comeback?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question6',
    type: 'text',
    text: 'Who kills Cersei?'
  },
  {
    name: 'question7',
    type: 'radio',
    text: 'Will Bran control or warg a dragon?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question8',
    type: 'radio',
    text: 'Is Cersei Pregnant?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question9',
    type: 'radio',
    text: 'Will she lose the baby?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ],
    dependsOn: 'question8'
  },
  {
    name: 'question10',
    type: 'text',
    text: 'Who is Azor Ahai?'
  },
  {
    name: 'question11',
    type: 'radio',
    text: 'Will Winterfell be destroyed?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question12',
    type: 'radio',
    text: 'Will King\'s Landing be destroyed?',
    answers: [
      { text: 'Yes', value: '1' },
      { text: 'No', value: '2' }
    ]
  },
  {
    name: 'question13',
    type: 'radio',
    text: 'Who will win Clegane Bowl?',
    answers: [
      { text: 'The Hound', value: '1' },
      { text: 'The Mountain', value: '2' }
    ]
  }
];

export async function handler() {
  try {
    for (let i = 0, x = questions.length; i < x; i++) {
      const question = questions[i];
      try {
        await refreshQuestionByName(question.name, question);
      } catch (e) {
        console.error(`Error refreshing character ${question.name}: ${e.message}`);
        console.error(e);
      }
    }
    return 'ok';
  } catch (e) {
    return e.message
  }
}
