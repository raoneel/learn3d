import * as React from 'react';

// Blockly Toolbox
// https://developers.google.com/blockly/guides/configure/web/toolbox

const WORKSPACE = 
`
<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none">
  <variables>
    <variable id="Mo?yj:I=b7:TXe,rjH,1">i</variable>
  </variables>
  <block type="controls_for" id="1(NRpHNLP=wfmjYDWL^:" x="113" y="62">
    <field name="VAR" id="Mo?yj:I=b7:TXe,rjH,1">i</field>
    <value name="FROM">
      <shadow type="math_number" id="%W3].8!BBZ+E/H4M5ci/">
        <field name="NUM">0</field>
      </shadow>
    </value>
    <value name="TO">
      <shadow type="math_number" id="8k0creP[/p$?E1DrnE~h">
        <field name="NUM">10</field>
      </shadow>
    </value>
    <value name="BY">
      <shadow type="math_number" id="mVYkxT\`#j4*li~APy1q;">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <statement name="DO">
      <block type="set_block" id="~9J{q|%op_1?,3Xz)ExH">
        <value name="type">
          <block type="math_number" id="D^4fv+xnLny~1~3iRyo:">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="x">
          <block type="math_number" id="/Vvgt;{h5(qmh2,\`Q0dR">
            <field name="NUM">64</field>
          </block>
        </value>
        <value name="y">
          <block type="variables_get" id="KR8;nySRHtL2L6Fal@0Q">
            <field name="VAR" id="Mo?yj:I=b7:TXe,rjH,1">i</field>
          </block>
        </value>
        <value name="z">
          <block type="math_number" id="aL)5~QhlotY~Q/D)Mw1*">
            <field name="NUM">64</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>
`

export function BlocklyWorkspace () {
  return (
    <div dangerouslySetInnerHTML={{__html: WORKSPACE}} />
  );
}