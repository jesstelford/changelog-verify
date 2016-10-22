#!/usr/bin/env node

var fs = require('fs');
var upath = require('upath');
var verifyChangelog = require('./index');

var fileName = process.argv[2] || 'CHANGELOG.md';

if (!upath.isAbsolute(fileName)) {
  fileName = upath.normalize(upath.join(process.cwd(), fileName));
}

try {

  var data = fs.readFileSync(fileName, 'utf8');

  verifyChangelog(data, function(error) {

    if (error) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });

} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error.message || error.toString());
  process.exit(1);
}
