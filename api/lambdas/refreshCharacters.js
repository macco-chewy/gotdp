import {
  refreshCharacterByName
} from '../models/character';

const characterNames = [
  'Jon Snow',
  'Daenerys Targaryen',
  'Tyrion Lannister',
  'Arya Stark',
  'The Night King',
  'Sansa Stark',
  'Jaime Lannister',
  'Gendry',
  'Samwell Tarly',
  'Cersei Lannister',
  'Bran Stark',
  'Lyanna Mormont',
  'Missandei',
  'Theon Greyjoy',
  'Euron Greyjoy',
  'The Mountain',
  'The Hound',
  'Qyburn',
  'Gilly',
  'Sam',
  'Davos Seaworth',
  'Varys',
  'Yara Greyjoy',
  'Jorah Mormont',
  'Beric Dondarrion',
  'Podrick Payne',
  'Hot Pie',
  'Eddison Tollett',
  'Tormund',
  'Brienne of Tarth',
  'Grey Worm',
  'Meera Reed',
  'Bronn',
  'Melisandre',
  'Ghost',
  'Drogon',
  'Rhaegal'
];

export async function handler() {
  try {
    characterNames.forEach(async name => {
      await refreshCharacterByName(name);
    });
    return 'ok';
  } catch (e) {
    return e.message
  }
}
