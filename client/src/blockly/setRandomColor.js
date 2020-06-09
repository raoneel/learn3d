import * as Blockly from "blockly";

Blockly.Blocks['set_random_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Random Color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Sets a random color (from the palette) for blocks");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['set_random_color'] = function(block) {
  var code = 'setRandomColor();\n';
  return code;
};