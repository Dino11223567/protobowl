// Generated by CoffeeScript 1.3.3
var damlev, fs, removeDiacritics, stopwords,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = require('fs');

removeDiacritics = require('./removeDiacritics').removeDiacritics;

damlev = require('./levenshtein').levenshtein;

console.log(removeDiacritics);

stopwords = 'dont,accept,either,underlined,prompt,on,in,to,the,of,is,a,mentioned,before,that,have,word,equivalents,forms,jr,sr,etc,a'.toLowerCase().split(',');

fs.readFile('sample.txt', 'utf8', function(err, data) {
  var answer, answers, clean, comp, compare, index, line, list, neg, p, part, pos, scores, sorted, sum, weight, weighted, word, _i, _j, _k, _l, _len, _len1, _len2, _ref, _results;
  if (err) {
    throw err;
  }
  answers = (function() {
    var _i, _len, _ref, _results;
    _ref = data.split("\n");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _results.push(JSON.parse(line).answer);
    }
    return _results;
  })();
  answers = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = answers.length; _i < _len; _i++) {
      answer = answers[_i];
      if (answer.length < 250) {
        _results.push(answer);
      }
    }
    return _results;
  })();
  _results = [];
  for (_i = 0, _len = answers.length; _i < _len; _i++) {
    answer = answers[_i];
    answer = answer.replace(/[\[\]\<\>\{\}][\w\-]+?[\[\]\<\>\{\}]/g, '');
    clean = (function() {
      var _j, _len1, _ref, _results1;
      _ref = answer.split(/[^\w]and[^\w]|[^\w]or[^\w]|\[|\]|\{|\}|\;|\,|\<|\>|\(|\)/g);
      _results1 = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        part = _ref[_j];
        _results1.push(part.trim());
      }
      return _results1;
    })();
    clean = (function() {
      var _j, _len1, _results1;
      _results1 = [];
      for (_j = 0, _len1 = clean.length; _j < _len1; _j++) {
        part = clean[_j];
        if (part !== '') {
          _results1.push(part);
        }
      }
      return _results1;
    })();
    pos = [];
    neg = [];
    for (_j = 0, _len1 = clean.length; _j < _len1; _j++) {
      part = clean[_j];
      part = removeDiacritics(part);
      part = part.replace(/\"|\'|\“|\”|\.|’|\:/g, '');
      part = part.replace(/-/g, ' ');
      if (/equivalent|word form|other wrong/.test(part)) {

      } else if (/do not|dont/.test(part)) {
        neg.push(part);
      } else if (/accept/.test(part)) {
        comp = part.split(/before|until/);
        if (comp.length > 1) {
          neg.push(comp[1]);
        }
        pos.push(comp[0]);
      } else {
        pos.push(part);
      }
    }
    for (_k = 0, _len2 = pos.length; _k < _len2; _k++) {
      p = pos[_k];
      list = (function() {
        var _l, _len3, _ref, _ref1, _results1;
        _ref = p.split(/\s/);
        _results1 = [];
        for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
          word = _ref[_l];
          if ((_ref1 = word.toLowerCase().trim(), __indexOf.call(stopwords, _ref1) < 0) && word.trim() !== '') {
            _results1.push(word);
          }
        }
        return _results1;
      })();
      compare = 'neucleus'.split(' ');
      if (list.length > 0) {
        console.log(list);
        sum = 0;
        for (index = _l = 0, _ref = list.length; 0 <= _ref ? _l < _ref : _l > _ref; index = 0 <= _ref ? ++_l : --_l) {
          scores = (function() {
            var _len3, _m, _results1;
            _results1 = [];
            for (_m = 0, _len3 = compare.length; _m < _len3; _m++) {
              word = compare[_m];
              _results1.push(damlev(list[index].toLowerCase(), word.toLowerCase()));
            }
            return _results1;
          })();
          sorted = scores.sort(function(a, b) {
            return a - b;
          });
          weight = 1;
          if (index === list.length - 1) {
            weight = 3;
          }
          weighted = sorted[0] * weight / list[index].length;
          sum += weighted;
        }
        console.log(sum);
      }
    }
    _results.push(console.log('------------------'));
  }
  return _results;
});
