#!/usr/bin/env node

var fs = require('fs');
var upath = require('upath');
var meow = require('meow');
var verifyChangelog = require('./index');

var cli = meow(`
  Usage
    $ changelog-verify <filename>

  Options
    --unreleased  Verify that the unreleased section has been modified.
                  (default: false)

  <filename> defaults to CHANGELOG.md
`, {
  flags: {
    unreleased: {
      type: 'boolean',
      default: false
    }
  }
});

var fileName = cli.input[0] || 'CHANGELOG.md';

if (!upath.isAbsolute(fileName)) {
  fileName = upath.normalize(upath.join(process.cwd(), fileName));
}

try {

  var data = fs.readFileSync(fileName, 'utf8');

  verifyChangelog(data, cli.flags.unreleased, function(error) {

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
