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
  { name: 'Sam', displayName: 'Baby Sam' },
  'Davos Seaworth',
  'Varys',
  'Yara Greyjoy',
  'Jorah Mormont',
  'Beric Dondarrion',
  'Podrick Payne',
  'Hot Pie',
  { name: 'Eddison Tollett', displayName: 'Dolorus Edd Tollett' },
  { name: 'Tormund', displayName: 'Tormund Giantsbane' },
  { name: 'Brienne Tarth', displayName: 'Brienne of Tarth' },
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
    for (let i = 0, x = characterNames.length; i < x; i++) {
      let name = characterNames[i];
      try {
        await refreshCharacterByName(name);
      } catch (e) {
        console.error(`Error refreshing character ${name}: ${e.message}`);
      }
    }
    return 'ok';
  } catch (e) {
    return e.message
  }
}
