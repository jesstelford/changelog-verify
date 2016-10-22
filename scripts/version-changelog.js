#!/usr/bin/env node

const {readFileSync, writeFileSync, statSync} = require('fs');
const githubUrlFromGit = require('github-url-from-git');

// eslint-disable-next-line import/no-extraneous-dependencies
const spawn = require('cross-spawn');

// Grab the current version of the package.
// When run as part of the `"version"` script
// (for example by `npm release`)
// it will be the _new_ version
const {version} = require('../package.json');

const fileName = process.argv[2] || 'CHANGELOG.md';

function insertHeading(data, versionString) {

  const date = new Date();

  return data.replace(
    /(## \[Unreleased\].*)/g,
    `
$1

## [${versionString}][] - ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
`.trim()
  );

}

function updateCompareUri(data, versionString) {

  const unreleasedLinkPattern = /\[Unreleased\]: (.*compare\/)(.*)\.\.\.HEAD/g;

  if (unreleasedLinkPattern.test(data)) {

    return data.replace(
      unreleasedLinkPattern,
      `
[Unreleased]: $1v${versionString}...HEAD
[${versionString}]: $1$2...v${versionString}
`.trim()
    );

  }

  const originUrl = spawn.sync('git', ['config', '--get', 'remote.origin.url']).stdout.toString().trim();

  if (!originUrl) {
    console.warn('[WARN]: Unable to determin origin URL for adding to changelog');
    return data;
  }

  // Insert a link since there isn't one
  const firstSha = spawn.sync('git', ['rev-list', '--max-parents=0', 'HEAD']).stdout.toString().trim();

  const compareUrl = `${githubUrlFromGit(originUrl)}/compare`;

  data = `${data}\n[Unreleased]: ${compareUrl}/v${versionString}...HEAD`;

  if (firstSha) {

    return `${data}\n[${versionString}]: ${compareUrl}/${firstSha}...v${versionString}`;

  } else {

    const treeUrl = `${githubUrlFromGit(originUrl)}/tree/v${versionString}`;

    return `${data}\n[${versionString}]: ${treeUrl}`;

  }

}

function addFileToGit(fileName) {

  statSync('.git');
  spawn.sync('git', ['add', fileName], {stdio: 'inherit'});

}

try {
  let data = readFileSync(fileName, 'utf8');

  // Add the heading for the new version number
  data = insertHeading(data, version);

  // Update the [Unreleased] URI
  // and add the new version URI
  data = updateCompareUri(data, version);

  writeFileSync(fileName, data, 'utf8');

  // Add it to the git stage
  // then npm will commit as part of the version bump
  addFileToGit(fileName);

  process.exit(0);

} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error.message || error.toString());
  process.exit(1);
}
