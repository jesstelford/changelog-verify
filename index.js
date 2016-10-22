module.exports = function verifyChangelog(data, done) {

  // Regex's store global state.
  // They must remain inside this function so they're reset each time it's
  // called
  var versionHeadingRegex = /(## \[.*?\].*)/g;
  var unreleasedHeadingRegex = /(## \[Unreleased\].*)/g;

  // Split on version headings
  var groups = data.split(versionHeadingRegex);

  // Drop chunks until we see a version heading
  // (that isn't the "[Unreleased]" heading)
  while (
    groups.length
    && (
      !versionHeadingRegex.test(groups[0])
      || unreleasedHeadingRegex.test(groups[0])
    )
  ) {
    groups.shift();
  }

  // At this stage, even indexes are the heading lines, and odd indexes are the
  // contents between those headings
  for (var contentIndex = 1; contentIndex < groups.length; contentIndex+=2) {

    var linesOfContent = groups[contentIndex]
      // Split by line
      .split('\n')
      // Remove any sub-heading lines
      .filter(function (line) { return line.indexOf('#') !== 0; })
      // Remove any empty lines
      .filter(function (line) { return !!line.trim(); });

    if (linesOfContent.length === 0) {
      return done('No valid CHANGELOG info found after heading "' + groups[contentIndex - 1] + '"');
    }
  }

  // Success!
  return done();

}
