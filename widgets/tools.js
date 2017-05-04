module.exports = {
  initContainer: function(container) {
    return container ? container : document.createElement("div");
  },
  fragmentFromString: function(htmlString) {
    return document.createRange().createContextualFragment(htmlString);
  }
};
