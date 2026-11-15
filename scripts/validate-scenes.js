const fs = require('fs');
const path = require('path');
const Ajv2020 = require('ajv/dist/2020');

const schemaPath = path.join(__dirname, '..', 'scenes.schema.json');
const scenesPath = path.join(__dirname, '..', 'scenes.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(scenesPath, 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error('scenes.json is invalid:');
  for (const err of validate.errors || []) {
    console.error('  ' + (err.instancePath || '/') + ' ' + err.message + (err.params ? ' ' + JSON.stringify(err.params) : ''));
  }
  process.exit(1);
}

const wordCount = data.scenes.reduce((n, s) => n + (s.text ? s.text.trim().split(/\s+/).length : 0), 0);
console.log('scenes.json OK —', data.scenes.length, 'scenes,', wordCount, 'total words of body text');
