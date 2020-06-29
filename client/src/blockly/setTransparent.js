import * as Blockly from "blockly";

Blockly.Blocks['set_transparent'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Transparent");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Any blocks drawn after this will be clear (air)");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['set_transparent'] = function(block) {
  var code = 'setTransparent();\n';
  return code;
};