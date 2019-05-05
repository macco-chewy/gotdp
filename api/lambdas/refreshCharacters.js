import {
  refreshCharacterByName
} from '../models/character';

const characters = [
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
  { name: 'Lyanna Mormont', status: '3' },
  'Missandei',
  'Theon Greyjoy',
  'Euron Greyjoy',
  {
    name: 'The Mountain',
    imageUrl: 'https://vignette.wikia.nocookie.net/gameofthrones/images/5/5d/Gregor_closeup_ep7.png/revision/latest/scale-to-width-down/344?cb=20170903033840'
  },
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
  { name: 'Eddison Tollett', displayName: 'Dolorus Edd Tollett', status: '3' },
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
    for (let i = 0, x = characters.length; i < x; i++) {
      let data = characters[i];
      try {
        await refreshCharacterByName(data);
      } catch (e) {
        console.error(`Error refreshing character ${data.name || data}: ${e.message}`);
      }
    }
    return 'ok';
  } catch (e) {
    return e.message
  }
}
