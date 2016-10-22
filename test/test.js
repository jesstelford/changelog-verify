var assert = require('assert');
var verifyChangelog = require('../index');

describe('Valid Changelog', function() {

  it('Contains text between headings', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]
- Foo

## [1.0.0][] - 2016-10-10
- Bar
      `.trim(),
      done
    );
  });

  it('Doesnt require an intro', function(done) {
    verifyChangelog(
      `
## [Unreleased][]
- Foo

## [1.0.0][] - 2016-10-10
- Bar
      `.trim(),
      done
    );
  });

  it('Can have subheadings', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [1.0.0][] - 2016-10-10
- Bar

### Added
- Zip
      `.trim(),
      done
    );
  });

  it('Doesnt need to have Unreleased changes', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [1.0.0][] - 2016-10-10
- Bar
      `.trim(),
      done
    );
  });

  it('Doesnt need to have Unreleased section', function(done) {
    verifyChangelog(
      `
# Changelog

## [1.0.0][] - 2016-10-10
- Bar
      `.trim(),
      done
    );
  });

  it('Supports multiple versions', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [3.0.0][] - 2016-10-12
- Foo

## [2.0.0][] - 2016-10-11
- Zip

## [1.0.0][] - 2016-10-10
- Bar
      `.trim(),
      done
    );
  });

  it('Supports only unreleased changes', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]
- Bar
      `.trim(),
      done
    );
  });

  it('Supports only empty unreleased section', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]
      `.trim(),
      done
    );
  });

  it('Supports no change headings', function(done) {
    verifyChangelog(
      `
# Changelog

Foobar
      `.trim(),
      done
    );
  });

  it('Supports an empty changelog', function(done) {
    verifyChangelog(
      '',
      done
    );
  });

});

describe('Invalid Changelog', function() {

  it('Has no changes between headings', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [1.0.0][] - 2016-10-10
      `.trim(),
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [1.0.0][] - 2016-10-10"');
        done();
      }
    );
  });

  it('Has no changes between headings', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [2.0.0][] - 2016-10-11

## [1.0.0][] - 2016-10-10
- Foo
      `.trim(),
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [2.0.0][] - 2016-10-11"');
        done();
      }
    );
  });

  it('Has no changes after last heading', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [2.0.0][] - 2016-10-11
- Bar

## [1.0.0][] - 2016-10-10
      `.trim(),
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [1.0.0][] - 2016-10-10"');
        done();
      }
    );
  });

  it('Doesnt count sub headings as valid', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [2.0.0][] - 2016-10-11

### Added

## [1.0.0][] - 2016-10-10
- Foo
      `.trim(),
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [2.0.0][] - 2016-10-11"');
        done();
      }
    );
  });

  it('Ignores white space', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [2.0.0][] - 2016-10-11

\t

## [1.0.0][] - 2016-10-10
- Foo
      `.trim(),
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [2.0.0][] - 2016-10-11"');
        done();
      }
    );
  });

});
