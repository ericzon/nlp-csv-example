const { NlpManager } = require('node-nlp');
const fs = require('fs');
const csv = require('fast-csv');

const lang = 'en';

const manager = new NlpManager({ languages: [lang] });
const fileRows = [];

fs.createReadStream('test.csv')
  .pipe(csv.parse({ headers: false, delimiter: ';' }))
  .on('error', error => console.error(error))
  .on('data', row => {
    console.log('Row:',row);
    fileRows.push(row);
    manager.addDocument(lang, row[1], row[0]);
  })
  .on('end', async () => {
    await manager.train();
    manager.save();
    const utterance = 'I\'m hungry and I want to eat something';
    const response = await manager.process(lang, utterance);
    console.log(`Utterance: ${utterance}, Intent: ${response.intent}, score: ${response.score}`);
  });
