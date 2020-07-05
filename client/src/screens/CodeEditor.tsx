import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "./CodeEditor.scss";
import ReactResizeDetector from "react-resize-detector";
import { runUserCode } from "../noa/worldGen";
import * as Blockly from "blockly";
import { BlocklyToolbox } from "../components/BlocklyToolbox";
import { BlocklyWorkspace } from "../components/BlocklyWorkspace";
import { hashCode } from "../util/utils";
import "../blockly/customBlocks";
import Console from "../components/Console";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import SplitterLayout from "react-splitter-layout";
import ErrorModal from "../components/ErrorModal";
import { saveWorkspaceFn, getWorkspace } from "../firebase/firebaseInit";
import { store } from "../redux/store";
import { addConsoleMessage } from "../redux/actions/consoleActions";
import { myHistory } from "../util/routing";
var debounce = require("lodash.debounce");

const DEFAULT_CODE = "";

// Prevent code from being run too often
const debounceRunUserCode = debounce(runUserCode, 500);

export interface CodeEditorProps {
  workspaceId: string | undefined;
  setWorkspaceId(newId: string): void;
}

export interface CodeEditorState {
  editorWidth: number;
  editorHeight: number;
  editorValue: string;
  runningCode: boolean;
  editorType: "javascript" | "blockly";
  autoRunChecked: boolean;
  isWarningModalVisible: boolean;
  isSaving: boolean;
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
      autoRunChecked: true,
      isWarningModalVisible: false,
      isSaving: false,
    };
  }

  componentDidMount = async () => {
    this.loadNewWorkspace(this.props.workspaceId);
  };

  componentDidUpdate(prevProps: CodeEditorProps) {
    if (
      this.props.workspaceId !== prevProps.workspaceId
    ) {
      this.loadNewWorkspace(this.props.workspaceId);
    }
  }

  loadNewWorkspace = async (workspaceId: string | undefined) => {
    if (workspaceId) {
      // Load Blockly from Firestore
      let workspace = await getWorkspace(workspaceId);

      // Load blocks or text code depending on type saved
      if (workspace) {
        if (workspace.workspaceType === "BLOCKS") {
          this.loadBlocklyFromText(workspace.workspaceData);
        } else if (workspace.workspaceType === "TEXT") {
          // Still initialize blockly in background
          // But it won't override the incoming code
          this.setState(
            {
              editorValue: workspace.workspaceData,
              editorType: "javascript",
            },
            () => {
              this.initializeBlockly();
            }
          );
          this.onClickRun();
        }
      } else {
        this.initializeBlockly();
      }
    } else {
      this.initializeBlockly();
    }
  };

  onAceEditorLoad = (editor: any) => {
    this.aceEditor = editor;
  };

  /**
   * Load incoming XML Blockly workspace text
   * @param text XML text from Blockly
   */
  loadBlocklyFromText(text: string) {
    let toolbox = document.getElementById("toolbox");
    let xml = Blockly.Xml.textToDom(text);

    // Only do this on first load
    if (toolbox && !this.blocklyWorkspace) {
      this.blocklyWorkspace = Blockly.inject("blocklyDiv", {
        toolbox,
      });
    }

    if (this.blocklyWorkspace) {
      Blockly.Xml.domToWorkspace(xml, this.blocklyWorkspace);
      this.blocklyWorkspace.addChangeListener(this.onBlocklyUpdate);
    }
  }

  /**
   * Initialize a default blockly view
   */
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

    // If blockly is running in the background, don't update current value
    if (this.state.editorType === "javascript") {
      return;
    }

    this.setState({
      editorValue: code,
    });

    if (this.state.autoRunChecked) {
      this.onClickRun();
    }
  };

  onClickRun = () => {
    this.setState({
      runningCode: true,
    });
    debounceRunUserCode(this.state.editorValue, this.onCodeRunningDone);
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

    if (this.state.autoRunChecked) {
      this.onClickRun();
    }
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
    if (this.state.editorType === "javascript") {
      this.setState({
        isWarningModalVisible: true,
      });
    } else {
      this.finishSwitchingEditors();
    }
  };

  finishSwitchingEditors = () => {
    this.setState(
      {
        editorType:
          this.state.editorType === "javascript" ? "blockly" : "javascript",
        isWarningModalVisible: false,
      },
      () => {
        // Upon switching states, you need to resize the div to show properly
        if (this.state.editorType === "blockly") {
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

  onAutoRunCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Run after checking
    if (event.target.checked) {
      this.onClickRun();
    }

    this.setState({
      autoRunChecked: event.target.checked,
    });
  };

  closeWarningModal = () => {
    this.setState({
      isWarningModalVisible: false,
    });
  };

  onClickSave = async () => {
    if (this.blocklyWorkspace) {
      let text;

      if (this.state.editorType === "blockly") {
        let dom = Blockly.Xml.workspaceToDom(this.blocklyWorkspace);
        text = Blockly.Xml.domToText(dom);
      } else if (this.state.editorType === "javascript") {
        text = this.state.editorValue;
      }

      if (!text) {
        return;
      }

      this.setState({
        isSaving: true,
      });

      let workspaceResult = await saveWorkspaceFn({
        workspaceData: text,
        workspaceType: this.state.editorType === "blockly" ? "BLOCKS" : "TEXT",
      });

      this.setState({
        isSaving: false,
      });

      // // Change local route
      // window.history.replaceState(
      //   null,
      //   document.title,
      //   "/space/" + workspaceResult.data
      // );
      this.props.setWorkspaceId(workspaceResult.data);
      myHistory.push("/space/" + workspaceResult.data);

      store.dispatch(
        addConsoleMessage(
          `💾 Code saved! Share the link: ${window.location.href}`
        )
      );
    }
  };

  getSaveButtonText = () => {
    if (this.state.isSaving) {
      return "Saving...";
    }

    if (this.props.workspaceId) {
      return "Save As";
    }

    return "Save";
  };

  public render() {
    return (
      <div onKeyDown={this.onKeyDown} className="CodeEditor" id="CodeEditor">
        <SplitterLayout secondaryInitialSize={20} vertical={true} percentage>
          <div className="CodeEditor-EditorContainer">
            <div className="CodeEditor-Header">
              <Button
                className="CodeEditor-Header-Button"
                color="success"
                onClick={this.onClickRun}
              >
                Run
              </Button>
              <Button
                className="CodeEditor-Header-Button"
                color="primary"
                onClick={this.onClickSave}
                disabled={this.state.isSaving}
              >
                {this.getSaveButtonText()}
              </Button>
              <Button
                className="CodeEditor-Header-Button"
                color="info"
                onClick={this.switchEditor}
              >
                Switch{" "}
                {this.state.editorType === "blockly" ? "to code" : "to blocks"}
              </Button>
              <Form>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.onAutoRunCheckboxChanged}
                      checked={this.state.autoRunChecked}
                    />{" "}
                    <span className="CodeEditor-Header-Text">Auto-run</span>
                  </Label>
                </FormGroup>
              </Form>
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
                fontSize={14}
                style={{
                  display:
                    this.state.editorType === "javascript" ? "block" : "none",
                }}
              />
              <div
                style={{
                  width: this.state.editorWidth,
                  height: this.state.editorHeight,
                  display:
                    this.state.editorType === "blockly" ? "block" : "none",
                }}
                id="blocklyDiv"
              ></div>
            </div>
          </div>
          <Console />
        </SplitterLayout>
        <BlocklyToolbox />
        <BlocklyWorkspace />
        <ErrorModal
          onClose={this.closeWarningModal}
          onComplete={this.finishSwitchingEditors}
          isVisible={this.state.isWarningModalVisible}
        />
      </div>
    );
  }
}
