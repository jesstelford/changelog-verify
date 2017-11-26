# Changelog Verify

Ensure that your `CHANGELOG.md` contains a list of changes.

Goes great with
[`version-changelog`](https://github.com/jesstelford/version-changelog).

Add this to your `package.json`:

```json
{
  "scripts": {
    "version": "version-changelog CHANGELOG.md && changelog-verify CHANGELOG.md && git add CHANGELOG.md"
  }
}
```

Now whenever you execute `npm version`
(or [`np`](https://github.com/sindresorhus/np)),
your `CHANGELOG.md` will be given the correct version info,
checked for validity
(did you forget to add changelog notes?)
then added to the release commit.

## Options

```
  Verify a changelog has correct entries

  Usage
    $ changelog-verify <filename>

  Options
    --unreleased  Verify that the unreleased section has been modified.
                  (default: false)

  <filename> defaults to CHANGELOG.md
```

The `--unreleased` flag is great for confirming PRs contain a CHANGELOG note.

## Usage

Given the following `./CHANGELOG.md`

```markdown
# Changelog

## [2.0.0] - 2016-10-11

- Reticulated the splines
```

Executing the verficiation script

```bash
changelog-verify ./CHANGELOG.md
```

Will return success (`0`).

See the [tests](test/test.js) for more usage examples.

## Changelog format

This tool assumes a particular format for your changelog,
keeping in style with http://keepachangelog.com:

```markdown
<some intro text>
## [Unreleased]
<optional unreleased notes>
## [<version number>]
<required release notes>
```

Where `<required release notes>` must contain at least one non-empty string
which isn't a heading.
