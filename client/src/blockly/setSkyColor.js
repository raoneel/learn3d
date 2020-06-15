import * as Blockly from "blockly";

Blockly.Blocks['set_sky_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Sky Color")
        .appendField(new Blockly.FieldColour("#3366ff"), "sky_color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['set_sky_color'] = function(block) {
  var colour_sky_color = block.getFieldValue('sky_color');
  // TODO: Assemble JavaScript into code variable.
  var code = `setSkyColor("${colour_sky_color}");\n`;
  return code;
};