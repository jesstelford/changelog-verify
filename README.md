# Changelog Verify

Ensure that your `CHANGELOG.md` contains a list of changes.

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

## Options

The cli takes a single optional parameter:
the changelog filename:

```
changelog-verify [filename]
```

`filename` can be a path relative to the current working directory,
or an absolute path.
