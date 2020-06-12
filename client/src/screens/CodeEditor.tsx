import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "./CodeEditor.scss";
import { noa } from "../noa/noaSetup";
import ReactResizeDetector from "react-resize-detector";
import { runUserCode } from "../noa/worldGen";
import * as Blockly from "blockly";
import { BlocklyToolbox } from "../components/BlocklyToolbox";
import "../blockly/setBlock";
import "../blockly/setColor";
import "../blockly/setRandomColor";
import { BlocklyWorkspace } from "../components/BlocklyWorkspace";
import { hashCode } from "../util/utils";

const DEFAULT_CODE = "";

export interface CodeEditorProps {}

export interface CodeEditorState {
  editorWidth: number;
  editorHeight: number;
  editorValue: string;
  runningCode: boolean;
  editorType: "javascript" | "blockly";
}

interface JSInterpreter {}

export default class CodeEditor extends React.PureComponent<
  CodeEditorProps,
  CodeEditorState
> {
  blocklyWorkspace: Blockly.WorkspaceSvg | undefined;
  aceEditor: any;
  lastCodeHash: number = 0;

  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      editorHeight: 500,
      editorWidth: 500,
      editorValue: DEFAULT_CODE,
      runningCode: false,
      editorType: "blockly",
    };
  }

  componentDidMount() {
    this.initializeBlockly();
  }

  onAceEditorLoad = (editor: any) => {
    this.aceEditor = editor;
  };

  initializeBlockly() {
    let toolbox = document.getElementById("toolbox");

    if (toolbox) {
      this.blocklyWorkspace = Blockly.inject("blocklyDiv", {
        toolbox,
      });

      let workspaceBlocks = document.getElementById("workspaceBlocks");
      /* Load blocks to workspace. */

      if (workspaceBlocks) {
        Blockly.Xml.domToWorkspace(workspaceBlocks, this.blocklyWorkspace);
      }

      this.blocklyWorkspace.addChangeListener(this.onBlocklyUpdate);
    }
  }

  onBlocklyUpdate = () => {
    if (!this.blocklyWorkspace) {
      return;
    }

    //@ts-ignore
    let code = Blockly.JavaScript.workspaceToCode(this.blocklyWorkspace);

    // Don't rerun if the code is the same
    let currentHash = hashCode(code);
    if (currentHash === this.lastCodeHash) {
      return;
    }
    this.lastCodeHash = currentHash;

    this.setState({
      editorValue: code,
    });
    this.onClickRun();
  };

  onClickRun = () => {
    this.setState({
      runningCode: true,
    });
    runUserCode(this.state.editorValue, this.onCodeRunningDone);
  };

  onCodeRunningDone = () => {
    this.setState({
      runningCode: false,
    });
  };

  onEditorChange = (newValue: string, event: any) => {
    this.setState({
      editorValue: newValue,
    });
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  onResize = (width: number, height: number) => {
    this.setState({
      editorWidth: width,
      editorHeight: height,
    });

    if (this.blocklyWorkspace) {
      Blockly.svgResize(this.blocklyWorkspace);
    }
  };

  /**
   * Switch between javascript and blockly editors
   */
  switchEditor = () => {
    this.setState(
      {
        editorType:
          this.state.editorType === "javascript" ? "blockly" : "javascript",
      },
      () => {
        // Upon switching states, you need to resize the div to show properly
        if (this.state.editorType == "blockly") {
          if (this.blocklyWorkspace) {
            Blockly.svgResize(this.blocklyWorkspace);
          }
        } else if (this.state.editorType === "javascript") {
          if (this.aceEditor) {
            this.aceEditor.resize();
            this.aceEditor.renderer.updateFull();
          }
        }
      }
    );
  };

  public render() {
    return (
      <div onKeyDown={this.onKeyDown} className="CodeEditor" id="CodeEditor">
        <div className="CodeEditor-Header">
          <button onClick={this.onClickRun}>Run</button>
          <button onClick={this.switchEditor}>Switch</button>
        </div>
        <div className="CodeEditor-Editor">
          <ReactResizeDetector
            refreshMode="debounce"
            refreshRate={100}
            handleWidth
            handleHeight
            onResize={this.onResize}
          />
          <AceEditor
            onLoad={this.onAceEditorLoad}
            mode="javascript"
            theme="monokai"
            name="CodeEditor"
            onChange={this.onEditorChange}
            value={this.state.editorValue}
            editorProps={{ $blockScrolling: false }}
            setOptions={{ useWorker: false }}
            width={this.state.editorWidth + "px"}
            height={this.state.editorHeight + "px"}
            style={{
              display:
                this.state.editorType === "javascript" ? "block" : "none",
            }}
          />
          <div
            style={{
              width: this.state.editorWidth,
              height: this.state.editorHeight,
              display: this.state.editorType === "blockly" ? "block" : "none",
            }}
            id="blocklyDiv"
          ></div>
        </div>
        <BlocklyToolbox />
        <BlocklyWorkspace />
      </div>
    );
  }
}
