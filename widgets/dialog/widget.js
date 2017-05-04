
module.exports = Dialog;

require('./style.scss');
var html = require('./template.html');

function Dialog(opts) {

  var _dialog = document.createElement("div");
  _dialog.classList.add("ps-dialog");
  _dialog.innerHTML = html;

  _dialog.querySelector(".js-dialog-title").textContent = opts.title;

  _dialog.querySelector(".js-dialog-content").appendChild(opts.content);

  var controlsDiv = _dialog.querySelector(".js-dialog-controls");
  opts.buttons.forEach(function(button) {
    var btn = document.createElement("button");
    btn.textContent = button.label;
    btn.addEventListener("click", button.callback);
    controlsDiv.appendChild(btn);
  });

  document.body.appendChild(_dialog);

  this.close = function () {
    document.body.removeChild(_dialog);
  };
}
