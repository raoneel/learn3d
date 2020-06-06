import * as Blockly from "blockly";

Blockly.Blocks['set_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create Block");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("y");
    this.appendValueInput("z")
        .setCheck("Number")
        .appendField("z");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Set Block");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['set_block'] = function(block) {
  // Default value of -1 which will draw the block out of bounds
  // When the block is being dragged, it will change all fields to default value
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || -1;
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || -1;
  var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC) || -1;

  var code = `setBlock(${value_x}, ${value_y}, ${value_z});\n`;
  return code;
};
