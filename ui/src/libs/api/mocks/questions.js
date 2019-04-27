export const questions = {
  "question01": {
    "type": "Question",
    "id": "c896e502-e383-4187-b517-a7d6d3065c14",
    "name": "question01",
    "version": 1,
    "createDt": 1556318494360,
    "updateDt": 1556318494360,
    "attributes": {
      "type": "text",
      "text": "Who will sit the Iron Throne?"
    }
  },
  "question02": {
    "type": "Question",
    "id": "dfb83c0e-3abc-400b-aa0f-05111c356731",
    "name": "question02",
    "version": 1,
    "createDt": 1556318494968,
    "updateDt": 1556318494968,
    "attributes": {
      "type": "radio",
      "answers": [
        {
          "value": "1",
          "text": "Yes"
        },
        {
          "value": "2",
          "text": "No"
        }
      ],
      "text": "Is Daenerys Pregnant?"
    }
  },
  "question03": {
    "type": "Question",
    "id": "a4852937-237c-40fc-9af2-e5d28284bde8",
    "name": "question03",
    "version": 1,
    "createDt": 1556318495310,
    "updateDt": 1556318495310,
    "attributes": {
      "answers": [
        {
          "value": "1",
          "text": "Yes"
        },
        {
          "value": "2",
          "text": "No"
        }
      ],
      "text": "Will she lose the baby?",
      "type": "radio",
      "dependsOn": "question02"
    }
  }
};
