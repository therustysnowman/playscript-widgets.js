module.exports = ErrorBar;

var Tools = require("../tools");

function ErrorBar(opts) {

  var _element = Tools.initContainer(opts.container);
  _element.classList.add("ps-flex-horiz");
  _element.innerHTML = require("./template.html");

  var _msg = _element.querySelector(".js-message");
  var _prev = _element.querySelector("button[name=prev]");
  var _next = _element.querySelector("button[name=next]");

  _prev.addEventListener("click", function() {
    _index--;
    if (_index < 0) {
      _index = 0;
    }
    refresh();
  });

  _next.addEventListener("click", function() {
    _index++;
    if (_index >= _errors.length) {
      _index = _errors.length-1;
    }
    refresh();
  });

  var _errors = [];
  var _index = -1;

  function show () {
    _element.style.display = "flex";
  }

  function hide() {
    _element.style.display = "none";
  }

  function refresh() {
    if (_index < 0) {
      hide();
    } else {
      show();
      if (_index <= 0) {
        _index = 0;
        _prev.disabled = true;
      } else {
        _prev.disabled = false;
      }
      if (_index >= _errors.length - 1) {
        _index = _errors.length - 1;
        _next.disabled = true;
      } else {
        _next.disabled = false;
      }
      _msg.textContent = _errors[_index];
    }
  };

  this.clear = function() {
    _errors = [];
    _index = -1;
    refresh();
  }

  this.setErrors = function(errors) {
    _errors = errors;
    _index = 0;
    refresh();
  }
}
