
module.exports = {
  dialog: _dialog
};

var Dialog = require('../dialog/dialog');
var Tools = require("../tools");

require('./style.scss');

function _dialog(opts) {

  var result = opts.callback || playscript.util.noop;

  var finder = new AssetFinder(opts);

  var dialogHandle = new Dialog({
    title: "Asset finder",
    content: finder._element,
    buttons: [
      {
        label: "Select",
        callback: function() {
          dialogHandle.close();
          result(finder.selected());
        }
      },
      {
        label: "Cancel",
        callback: function() {
          dialogHandle.close();
        }
      }
    ]
  });
}

function AssetFinder(opts) {

  var assetLibrary = playscript.assetLibrary();

  this._element = Tools.initContainer(opts.container);
  this._element.innerHTML = require("./listTemplate.html");

  var list = this._element.querySelector("ul");

  assetLibrary.idList(opts.type).forEach(function(id) {
    var asset = assetLibrary.getById(opts.type, id);
    var li = document.createElement("li");
    li.textContent = asset.info.name;
    li.dataset.id = id;
    list.appendChild(li);
  });

  list.addEventListener("click", function(event) {
    list.querySelectorAll("li.selected").forEach(function(itm) {
      itm.classList.remove("selected");
    });
    event.target.classList.add("selected");
  });

  this.selected = function() {
    var val = null;
    var itm = list.querySelector("li.selected");
    if (itm !== null) {
      val = itm.dataset.id;
    }
    return val;
  }
}
