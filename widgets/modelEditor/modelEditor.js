
module.exports = {
  constructor: ModelEditor
};


var Dialog = require('../dialog/dialog');
var Util = require("../../lib/util");
var createTrigger = require("../../lib/trigger").createTrigger;

require("./style.scss");

/** FieldEditor ***************************************************************/

function FieldEditor(className, template, opts) {

  this._opts = opts;

  this._name = opts.name;
  this._model = opts.model;
  this._group = opts.group;

  this._wrapper = document.createElement("div");
  this._wrapper.classList.add(className);
  this._wrapper.innerHTML = template;

  if (opts.hideLabel === true) {
    this._wrapper.querySelector(".js-label").style.display = "none";
  } else {
    this._wrapper.querySelector(".js-label").textContent =
      Util.isUndefined(opts.model.label) ? opts.name : opts.model.label;
  }

  this._trigger = createTrigger(this);

  var that = this;
  var delButton = this._wrapper.querySelector(".js-delField");
  if (delButton !== null) {
    if (opts.deletable === true) {
      delButton.addEventListener("click", function() {
        that._trigger.fire("delete");
        that._wrapper.parentNode.removeChild(that._wrapper);
      });
    } else {
      delButton.parentNode.removeChild(delButton);
    }
  }
}

FieldEditor.prototype.getElement = function() {
  return this._wrapper;
}

FieldEditor.prototype.getGroup = function() {
  return this._group;
}

FieldEditor.prototype.getName = function() {
  return this._name;
}

FieldEditor.prototype._changed = function() {
  this._trigger.fire("change", this);
}

FieldEditor.prototype.appendTo = function(container) {
  container.appendChild(this._wrapper);
}

FieldEditor.prototype.setData = function(data) {
  if (!Util.isUndefined(data[this._name])) {
    this.setValue(data[this._name]);
  }
}

FieldEditor.prototype.getData = function(data) {
  if (this.isSet()) {
    data[this._name] = this.getValue();
  }
}

FieldEditor.prototype.getModel = function(modelContainer) {
  modelContainer[this._name] = this._model;
}

FieldEditor.prototype.isSet = function() {
  return true;
}

FieldEditor.prototype.setValue = function(value) {}

FieldEditor.prototype.getValue = function() {}

/** InputEditor ***************************************************************/

function InputEditor(opts) {

  FieldEditor.call(this, "ps-inputEditor", require('./inputEditor.html'), opts);

  this._input = this._wrapper.querySelector("input");
  this._input.type = "text";

  if (opts.model.readonly === true) {
    this._input.disabled = true;
  }

  this.setData(opts.data);

  var that = this;
  this._input.addEventListener("change", function() {
    that._changed();
  });
}
InputEditor.prototype = Object.create(FieldEditor.prototype);
InputEditor.prototype.constructor = InputEditor;

InputEditor.prototype.setPlaceholder = function(placeholder) {
  if (this._opts.model.readonly !== true) {
    this._input.placeholder = "string";
  }
}

InputEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

InputEditor.prototype.setValue = function(value) {
  this._input.value = value;
}

InputEditor.prototype.getValue = function() {
  return this._input.value;
}

/** StringEditor **************************************************************/

function StringEditor(opts) {
  InputEditor.call(this, opts);
  this.setPlaceholder("string");
}
StringEditor.prototype = Object.create(InputEditor.prototype);
StringEditor.prototype.constructor = StringEditor;

/** IntegerEditor *************************************************************/

function IntegerEditor(opts) {
  InputEditor.call(this, opts);
  this.setPlaceholder("integer");
}
IntegerEditor.prototype = Object.create(InputEditor.prototype);
IntegerEditor.prototype.constructor = IntegerEditor;

/** IntegerEditor *************************************************************/

function DoubleEditor(opts) {
  InputEditor.call(this, opts);
  this.setPlaceholder("double");
}
DoubleEditor.prototype = Object.create(InputEditor.prototype);
DoubleEditor.prototype.constructor = DoubleEditor;

/** StringListEditor **********************************************************/

function StringListEditor(opts) {

  FieldEditor.call(this, "ps-listEditor", require("./listEditor.html"), opts);

  this._list = this._wrapper.querySelector(".js-list");

  this.setData(opts.data);

  var that = this;
  this._wrapper.querySelector(".js-add").addEventListener("click", function() {
    that.addListItem();
  });
}
StringListEditor.prototype = Object.create(StringEditor.prototype);
StringListEditor.prototype.constructor = StringListEditor;

StringListEditor.prototype.addListItem = function(value) {

  var that = this;

  value = Util.defaultVal(value, "");

  var newItem = document.createElement("div");
  newItem.classList.add("ps-modelEditor-fieldListItem");
  newItem.innerHTML = require("./listEditorItem.html");
  this._list.appendChild(newItem);

  var input = newItem.querySelector("input");
  input.value = value;
  input.addEventListener("change", function() {
    that._changed();
  });

  newItem.querySelector("button").addEventListener("click", function() {
    that._list.removeChild(newItem);
    that._changed();
  });
}

StringListEditor.prototype.clearListItems = function(value) {
  this._list.innerHTML = "";
}

StringListEditor.prototype.setValue = function(value) {
  this.clearListItems();

  var that = this;
  value.forEach(function(val) {
    that.addListItem(val);
  });
}

StringListEditor.prototype.getValue = function() {
  var list = [];
  this._list.querySelectorAll("input").forEach(function(input) {
    if (input.value !== "") {
      list.push(input.value);
    }
  });
  return list;
}

/** SelectEditor **************************************************************/

function SelectEditor(opts, choices) {

  FieldEditor.call(this, "ps-selectEditor", require("./selectEditor.html"), opts);

  this._select = this._wrapper.querySelector("select");

  var that = this;

  (choices || opts.model.choices || []).forEach(function(choice) {
    if (choice.value === "") {
      that._select.querySelector("option[value='']").textContent = choice.label;
    } else {
      var option = document.createElement("option");
      option.textContent = choice.label;
      option.value = choice.value;
      that._select.appendChild(option);
    }
  });

  this.setData(opts.data);

  this._select.addEventListener("change", function() {
    that._changed();
  });
}
SelectEditor.prototype = Object.create(FieldEditor.prototype);
SelectEditor.prototype.constructor = SelectEditor;

SelectEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

SelectEditor.prototype.setValue = function(value) {
  this._select.value = this.toOptionValue(value);
}

SelectEditor.prototype.getValue = function() {
  return this.fromOptionValue(this._select.value);
}

SelectEditor.prototype.toOptionValue = function(value) {
  return value;
}

SelectEditor.prototype.fromOptionValue = function(value) {
  return value;
}

/** ChoiceEditor **************************************************************/

function ChoiceEditor(opts) {
  SelectEditor.call(this, opts);
}
ChoiceEditor.prototype = Object.create(SelectEditor.prototype);
ChoiceEditor.prototype.constructor = ChoiceEditor;

/** BooleanEditor *************************************************************/

function BooleanEditor(opts) {
  SelectEditor.call(this, opts, [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
  ]);
}
BooleanEditor.prototype = Object.create(SelectEditor.prototype);
BooleanEditor.prototype.constructor = BooleanEditor;

BooleanEditor.prototype.fromOptionValue = function(value) {
  if (value === "Y") {
    return true;
  } else if (value === "N" ) {
    return false;
  }
}

BooleanEditor.prototype.toOptionValue = function(value) {
  if (value === true) {
    return "Y";
  } else if (value === false) {
    return "N";
  } else {
    return "";
  }
}

/** VectorEditor **************************************************************/

function VectorEditor(opts) {

  FieldEditor.call(this, "ps-vectorEditor", require("./vectorEditor.html"), opts);

  if (!Util.isUndefined(opts.model.xLabel)) {
    this._wrapper.querySelector(".js-x-label").textContent = model.xLabel;
  }
  if (!Util.isUndefined(opts.model.yLabel)) {
    this._wrapper.querySelector(".js-y-label").textContent = model.yLabel;
  }

  this._xInput = this._wrapper.querySelector(".js-x-val");
  this._yInput = this._wrapper.querySelector(".js-y-val");

  this.setData(opts.data);

  var that = this;
  this._xInput.addEventListener("change", function() {
    that._changed();
  });
  this._yInput.addEventListener("change", function() {
    that._changed();
  });
}
VectorEditor.prototype = Object.create(FieldEditor.prototype);
VectorEditor.prototype.constructor = VectorEditor;

VectorEditor.prototype.setValue = function(value) {
  var that = this;
  this._xInput.value = Util.defaultVal(value.x, "");
  this._yInput.value = Util.defaultVal(value.y, "");
}

VectorEditor.prototype.getValue = function() {
  return { x: this._xInput.value, y: this._yInput.value };
}

/** FunctionEditor ************************************************************/

var FunctionEditorObj = require('../functionEditor/functionEditor');

function FunctionEditor(opts) {

  FieldEditor.call(this, "ps-buttonEditor", require('./buttonEditor.html'), opts);

  this._button = this._wrapper.querySelector("button");
  this.setValue();

  this.setData(opts.data);

  var that = this;

  this._button.addEventListener("click", function() {

    var container = document.createElement("div");
    var funcEditor = new FunctionEditorObj({
      value: that.isSet() ? that.getValue() : ""
    });
    funcEditor.appendTo(container);

    var dialogHandle = new Dialog({
      title: "Function: " + that._name,
      content: container,
      buttons: [
        {
          label: "OK",
          callback: function() {
            if (funcEditor.validate()) {
              that.setValue(funcEditor.getValue());
              that._changed();
              dialogHandle.close();
            }
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
  });
}
FunctionEditor.prototype = Object.create(FieldEditor.prototype);
FunctionEditor.prototype.constructor = FunctionEditor;

FunctionEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

FunctionEditor.prototype.setValue = function(value) {
  this._value = value;
  if (this.isSet()) {
    this._button.textContent = "Edit";
  } else {
    this._button.textContent = "Set";
  }
}

FunctionEditor.prototype.getValue = function() {
  return this._value;
}

/** AssetEditor ***************************************************************/

function AssetEditor(opts) {

  FieldEditor.call(this, "ps-assetEditor", require('./assetEditor.html'), opts);

  this._assetType = opts.model.assetType;

  this._input = this._wrapper.querySelector("input");
  this._input.type = "text";

  this.setData(opts.data);

  var that = this;
  this._input.addEventListener("change", function() {
    that._changed();
  });

  this._selectButton = this._wrapper.querySelector("button.js-selectAsset");
  this._selectButton.addEventListener("click", function() {
    require("../assetFinder/assetFinder").dialog({
      type: opts.model.assetType,
      callback: function(val) {
        if (val !== null) {
          that.setValue(val);
        }
      }
    });
  });
}
AssetEditor.prototype = Object.create(FieldEditor.prototype);
AssetEditor.prototype.constructor = InputEditor;

AssetEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

AssetEditor.prototype.setValue = function(value) {
  this._value = value;
  if (value != null) {
    this._input.value = playscript.assetLibrary().getById(this._assetType, value).info.name;
  } else {
    this._input.value = "";
  }
}

AssetEditor.prototype.getValue = function() {
  return this._value;
}

/** Model editor **************************************************************/

var TYPES = {
  asset: { label: "Asset" },
  boolean: { label: "Boolean" },
  choice: { label: "Choice" },
  double: { label: "Double" },
  function: { label: "Function" },
  integer: { label: "String" },
  string: { label: "String" },
  stringlist: { label: "String List" },
  vector: { label: "Vector" }
};

function Section(container, sectionName, sectionDef, data) {

  var items = [];

  var _trigger = createTrigger(this);

  function _triggerChange() {
    _trigger.fire("change");
  }

  function _addEditor(editor) {
    if (editor !== null) {
      element.querySelector(".js-sectionContent").appendChild(editor.getElement());
      editor.addListener(_listener);
      items.push(editor);
    }
  }

  function _addControl(control) {
    element.querySelector(".js-sectionControls").appendChild(control);
  }

  var _listener = {
    change: _triggerChange,
    delete: function(event) {
      var field = event.source;
      var index = items.indexOf(field);
      if (index > -1) {
        items.splice(index, 1);
        _triggerChange();
      }
    }
  };

  var element = document.createElement("div");
  element.innerHTML = require("./section.html");
  element.classList.add("ps-section");
  element.querySelector(".js-sectionTitle").textContent = Util.defaultVal(sectionDef.title, sectionName);
  container.appendChild(element);

  var content = Util.defaultVal(sectionDef.content, {});
  Object.keys(content).forEach(function(itmName) {
    _addEditor(createEditor({
      name: itmName,
      group: sectionName,
      model: content[itmName],
      data: data
    }, sectionDef.defaultType));
  });

  var custom = false;
  if (sectionDef.custom === true && !Util.isUndefined(sectionDef.customTypes)) {

    custom = true;

    var customModel = Util.defaultVal(data._model, {});
    Object.keys(customModel).forEach(function(itmName) {
      _addEditor(createEditor({
        name: itmName,
        group: sectionName,
        model: customModel[itmName],
        data: data
      }, sectionDef.defaultType));
    });

    function addCustomDialog() {

      var dialogContent = document.createElement("div");
      dialogContent.innerHTML = require("./customDialog.html");

      var typeSelect = dialogContent.querySelector(".js-types");
      Object.keys(TYPES).forEach(function(type) {
        if (sectionDef.customTypes.indexOf(type) !== -1) {
          var option = document.createElement("option");
          option.value = type;
          option.textContent = TYPES[type].label;
          typeSelect.appendChild(option);
        }
      });

      var dialogHandle = new Dialog({
        title: "Add custom data item",
        content: dialogContent,
        buttons: [
          {
            label: "Create",
            callback: function() {
              var name = dialogContent.querySelector("input").value;
              var type = dialogContent.querySelector("select").value;
              if (name !== "" &&  type !== "") {
                _addEditor(createEditor({
                  deletable: true,
                  group: sectionName,
                  name: name,
                  model: {
                    type: type
                  },
                  data: data
                }));
                _triggerChange();
                dialogHandle.close();
              }
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

    var addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.addEventListener("click", function() {
      addCustomDialog();
    });
    _addControl(addButton);
  }

  this.destroy = function() {
      container.removeChild(section);
  };

  this.getData = function(data) {
    data[sectionName] = Util.defaultVal(data[sectionName], {});
    if (custom === true) {
      data[sectionName]._model = Util.defaultVal(data[sectionName]._model, {});
    }
    items.forEach(function(itm) {
      itm.getData(data[sectionName]);
      if (custom === true) {
        itm.getModel(data[sectionName]._model);
      }
    });
  }
}

function createEditor(args, defaultType) {

  var editor = null;

  var type = Util.defaultVal(args.model.type, defaultType);

  switch (type) {
    case "string":
      editor = new StringEditor(args);
      break;
    case "stringlist":
      editor = new StringListEditor(args);
      break;
    case "integer":
      editor = new IntegerEditor(args);
      break;
    case "double":
      editor = new DoubleEditor(args);
      break;
    case "boolean":
      editor = new BooleanEditor(args);
      break;
    case "choice":
      editor = new ChoiceEditor(args);
      break;
    case "vector":
      editor = new VectorEditor(args);
      break;
    case "function":
      editor = new FunctionEditor(args);
      break;
    case "asset":
      editor = new AssetEditor(args);
      break;
  }

  return editor;
}

function ModelEditor(container, model, data) {

  var _trigger = createTrigger(this);

  function triggerChange() {
    _trigger.fire("change");
  }

  var _listener = {
    change: triggerChange,
    delete: function(event) {
      var field = event.source;
      var index = objects[field.getGroup()].indexOf(field);
      if (index > -1) {
        objects[field.getGroup()].splice(index, 1);
        triggerChange();
      }
    }
  };

  data = Util.defaultVal(data, {});

  var heading;

  var sections = [];

  Object.keys(model).forEach(function(sectionName) {
    var section = new Section(
      container,
      sectionName,
      model[sectionName],
      Util.defaultVal(data[sectionName], {})
    );
    section.addListener(_listener);
    sections.push(section);
  });

  this.getData = function() {
    var data = {};
    sections.forEach(function(section) {
      section.getData(data);
    });
    return data;
  };
}
