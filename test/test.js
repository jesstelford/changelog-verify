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
      false,
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
      false,
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
      false,
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
      false,
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
      false,
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
      false,
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
      false,
      done
    );
  });

  it('Supports only empty unreleased section', function(done) {
    verifyChangelog(
      `
# Changelog

## [Unreleased][]
      `.trim(),
      false,
      done
    );
  });

  it('Supports no change headings', function(done) {
    verifyChangelog(
      `
# Changelog

Foobar
      `.trim(),
      false,
      done
    );
  });

  it('Supports an empty changelog', function(done) {
    verifyChangelog(
      '',
      false,
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
      false,
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
      false,
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
      false,
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
      false,
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
      false,
      function(error) {
        assert(error === 'No valid CHANGELOG info found after heading "## [2.0.0][] - 2016-10-11"');
        done();
      }
    );
  });

});

describe('Unreleased Changelog', function() {
  describe('Valid Changelog', function() {

    it('Has a non empty Unreleased section', function(done) {
      verifyChangelog(
      `
# Changelog

## [Unreleased][]
- Foo

## [1.0.0][] - 2016-10-10
- Bar
        `.trim(),
        true,
        done
      );
    });
  });

  describe('Invalid Changelog', function() {

    it('Errors on an empty Unreleased section', function(done) {
      verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [1.0.0][] - 2016-10-10
- Bar
        `.trim(),
        true,
        function(error) {
          assert(error === 'No updates have been added to the "## [Unreleased]" section in CHANGELOG');
          done();
        }
      );
    });

    it('Errors when Unreleased section after a heading', function(done) {
      verifyChangelog(
      `
# Changelog

## [1.0.0][] - 2016-10-10
- Bar

## [Unreleased][]
- Foo
        `.trim(),
        true,
        function(error) {
          assert(error === '"## [Unreleased]" must be the first section in the CHANGELOG');
          done();
        }
      );
    });

    it('Has no Unreleased section', function(done) {
      verifyChangelog(
      `
# Changelog

## [1.0.0][] - 2016-10-10
- Bar
        `.trim(),
        true,
        function(error) {
          assert(error === 'CHANGELOG doesn\'t have a valid "## [Unreleased]" section');
          done();
        }
      );
    });
    
    it('Ignores Unreleased section when flag is false', function(done) {
      verifyChangelog(
      `
# Changelog

## [Unreleased][]

## [1.0.0][] - 2016-10-10
- Bar
        `.trim(),
        false,
        done
      );
    });
    
    it('Supports variadic arguments for flag / callback, defaulting to false', function(done) {
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
  });

});
