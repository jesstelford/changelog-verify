function scanToMatch(groups, match) {
  while (groups.length && !match(groups[0])) {
    groups.shift();
  }
}

function validateContent(content) {
  validContent = content
    // Split by line
    .split('\n')
    // Remove any sub-heading lines
    .filter(function (line) { return line.indexOf('#') !== 0; })
    // Remove any empty lines
    .filter(function (line) { return !!line.trim(); });

  return validContent.length > 0;
}

module.exports = function verifyChangelog(data, unreleasedNotEmpty, done) {
  // Variadic arguments
  if (typeof unreleasedNotEmpty === 'function') {
    done = unreleasedNotEmpty;
    unreleasedNotEmpty = false;
  }

  // Regex's store global state.
  // They must remain inside this function so they're reset each time it's
  // called
  var versionHeadingRegex = /(## \[.*?\].*)/g;
  var unreleasedHeadingRegex = /(## \[Unreleased\].*)/g;

  // Split on version headings
  var groups = data.split(versionHeadingRegex);

  if (unreleasedNotEmpty) {
    // If we are checking the unreleased section,
    // drop the first chunk if we don't see a heading
    scanToMatch(groups, (line) => versionHeadingRegex.test(line))
    
    if (!unreleasedHeadingRegex.test(groups[0]) || groups.length === 0) {
      // If the matched heading isn't an Unreleased section (or there are no matches)
      // check if there are any unreleased sections defined later
      scanToMatch(groups, (line) => unreleasedHeadingRegex.test(line));

      // If there are no matches, Unreleased hasn't been defined
      if (groups.length === 0) {
        return done('CHANGELOG doesn\'t have a valid "## [Unreleased]" section');
      }

      // Otherwise it has been defined, but it's not the first section
      return done('"## [Unreleased]" must be the first section in the CHANGELOG');
    }

    // At this stage, we have found an unreleased section
    // and Groups[1] is the content for that section
    if (!validateContent(groups[1])) {
      return done('No updates have been added to the "## [Unreleased]" section in CHANGELOG');
    }
  }

  // Drop chunks until we see a version heading
  // (that isn't the "[Unreleased]" heading)
  scanToMatch(groups, (line) => (
    versionHeadingRegex.test(line)
    && !unreleasedHeadingRegex.test(line)
  ))

  // At this stage, even indexes are the heading lines, and odd indexes are the
  // contents between those headings
  for (var contentIndex = 1; contentIndex < groups.length; contentIndex+=2) {

    if (!validateContent(groups[contentIndex])) {
      return done('No valid CHANGELOG info found after heading "' + groups[contentIndex - 1] + '"');
    }
  }

  // Success!
  return done();

}
