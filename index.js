#!/usr/bin/env node

var program = require('commander');
var twig = require('twig').twig;
var glob = require('glob');
var fs = require('fs');
var path = require('path');

var renderer = function(input, output) {
  if (!input) {
    throw new Error('No input passed');
  }

  if (!output) {
    throw new Error('No output passed');
  }

  output += '/';
  output = path.normalize(output);

  try {
    fs.mkdirSync(output);
  } catch (e) {
    if (e.errno !== 47) {
      throw e;
    }
  }

  glob(input, function(er, files) {
    files.forEach(function(file) {
      twig({
        path: file,
        load: function(template) {
          var targetFile = output + path.basename(file);

          fs.writeFileSync(targetFile, template.render(), { flags: 'w' });

          console.log('Wrote', targetFile);
        }
      });
    });
  });
};

program
  .version('0.1.0')
  .usage('<input> <output>')
  .action(renderer)
  .parse(process.argv);
