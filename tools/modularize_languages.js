#!/usr/bin/env node

// Finds every language file in lib/vendor/highlight.js/languages and adds
// a Node.js module export to each of them (useful when updating Highlight.js
// languages from upstream, where they do not have this definition).

var fs = require('fs');
var path = require('path');
var langPath = path.join(__dirname, '..', 'lib', 'vendor', 'highlight.js', 'languages');

var updateLanguage = function(text, callback) {
  var defIndex = text.indexOf('hljs.LANGUAGES');
  var newText = text.slice(0, defIndex) + "module.exports = function(hljs) {\n" + text.slice(defIndex) + "};\n";
  callback(newText);
};

fs.readdir(langPath, function(err, files) {
  if(err) { throw(err); }
  files.forEach(function(file) {
    var filePath = path.join(langPath, file);
    fs.readFile(filePath, 'utf8', function(err, text) {
      if(err) { throw(err); }
      updateLanguage(text, function(newText) {
        fs.writeFile(filePath, newText, 'utf8', function(err) {
          if(err) { throw(err); }
          console.log("Successfully wrote " + filePath);
        });
      });
    });
  });
});
