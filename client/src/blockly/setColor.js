import * as Blockly from "blockly";

Blockly.Blocks['setcolor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Change Color")
        .appendField(new Blockly.FieldColour("#ff0000"), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Change the color of the blocks you draw");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['setcolor'] = function(block) {
  var colour_color = block.getFieldValue('color');
  // TODO: Assemble JavaScript into code variable.
  var code = `setColor("${colour_color}");\n`;
  return code;
};