
module.exports = FunctionEditor;

require('./style.scss');

var ErrorBar = require("../errorBar/errorBar.js");
var Tools = require("../tools.js");

function FunctionEditor(opts) {

  var _element = Tools.initContainer(opts.container);

  _element.classList.add("ps-functionEditor");
  _element.classList.add("ps-flex-vert");
  _element.innerHTML = require("./template.html");

  var _editor = _element.querySelector("textarea");
  _editor.value = opts.value;

  var _errors = new ErrorBar({
    container: _element.querySelector(".js-errors")
  });
  _errors.clear();

  _element.addEventListener(["keyup", "change"], function() {
    validate();
  });

  this.getValue = function() {
    return _editor.value;
  }

  this.setValue = function(newValue) {
    _element._editor = newValue;
  }

  this.validate = function() {
    var valid = false;
    _errors.setErrors([
      "Number 1",
      "Number 2",
      "Number 3",
      "Number 4"
    ]);
    this.getValue();
    return valid;
  }

  this.appendTo = function(container) {
    container.appendChild(_element);
  }
}
