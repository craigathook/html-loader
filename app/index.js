'use strict';

var config = require('./config');
var htmlLoader = require('./HTMLLoader/HTMLLoader')
var Model = require('./Model.js');

var model = Model.getInstance();

btn1.onclick = function(){
	
  htmlLoader.load(model.background, document.getElementById('background'));
};
// btn2.onclick = function(){
//   htmlLoader.load('bg2.html', document.getElementById('background'));
// };
// btn3.onclick = function(){
//   htmlLoader.load('bg3.html', document.getElementById('background'));
// };

// Find: ([,|\}][\s$]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)
// Replace with: $1#content $2

// Breakdown of Regex

// ([,|\}][\s$]*) - Finds the } or , from the previous style followed by whitespace (spaces/tabs: \s, newlines: $). The closing brace\comma keeps the regex from looking inside the body of your style.
// [\.#]? - Matches the starting # or . in the style name, if it is present.
// -?[_a-zA-Z]+ - CSS style names can start with an underscore or letters. Also, style names can be prepended by a dash.
// [_a-zA-Z0-9-]* - Matches the rest of the style name. This can be omitted, but it might be nice to know the style name of all the styles that were modified.
// $1#content $2 - The } (or ,) and whitespace is left the way it was found ($1). It is followed by your inserted text #content (note the space), which is then followed by the style name ($2).
// Improved upon RustyTheBoyRobot and BoltClock♦ answer to allow for comments and media queries.

// Find: ([,|\}][\s$]*)((?|\/\/.*[\s$]+|.*\/\*.*\*\/[\s$]*|@media.*\{[\s$]*|)*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)

// Replace with: $1$2 #content $3