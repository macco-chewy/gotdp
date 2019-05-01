import { getAllUsers, refreshUserScore } from '../models/user';
import { getAllCharacters } from '../models/character';
import { getAllQuestions } from '../models/question';


export async function handler() {
  try {
    const users = await getAllUsers();
    const characters = await getAllCharacters();
    const questions = await getAllQuestions();
    const keys = Object.keys(users);
    for (let i = 0, x = keys.length; i < x; i++) {
      await refreshUserScore(users[keys[i]], characters, questions);
    }
    return 'ok';
  } catch (e) {
    return e.message;
  }
}
