import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "./CodeEditor.scss";
import { noa } from "../noa/noaSetup";
import ReactResizeDetector from "react-resize-detector";
import { runUserCode } from "../noa/worldGen";

const DEFAULT_CODE = 
`var a = 64;
var b = 20;
var c = 64;
var r = 20;

for (var i = a-r ; i < a + r; i++) {
  for (var j = b - r; j < b + r; j++) {
    for (var k = c - r; k < c + r; k++) {
        var color = (i + k) % 2 + 1;
        if (Math.pow((i - a), 2) + Math.pow((j - b), 2) + Math.pow((k - c), 2) < r * r) {
            setBlock(color, i, j, k);
        }
    }
  }
}
`;

export interface CodeEditorProps {}

export interface CodeEditorState {
  editorWidth: number;
  editorHeight: number;
  editorValue: string;
  runningCode: boolean;
}

interface JSInterpreter {}

export default class CodeEditor extends React.PureComponent<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      editorHeight: 500,
      editorWidth: 500,
      editorValue: DEFAULT_CODE,
      runningCode: false
    };
  }

  componentDidMount() {
    this.onClickRun();
  }

  onClickRun = () => {
    this.setState({
      runningCode: true
    });
    runUserCode(this.state.editorValue, this.onCodeRunningDone);
  };

  onCodeRunningDone = () => {
    this.setState({
      runningCode: false
    });
  }

  onEditorChange = (newValue: string, event: any) => {
    this.setState({
      editorValue: newValue
    })
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  onResize = (width: number, height: number) => {
    this.setState({
      editorWidth: width,
      editorHeight: height
    });
  };

  public render() {
    return (
      <div onKeyDown={this.onKeyDown} className="CodeEditor" id="CodeEditor">
        <div className="CodeEditor-Header">
          <button onClick={this.onClickRun}>Run</button>
          <span>{this.state.runningCode ? "Running" : "Done"}</span>
        </div>
        <div className="CodeEditor-Editor">
          <ReactResizeDetector refreshMode="debounce" refreshRate={100} handleWidth handleHeight onResize={this.onResize} />
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="CodeEditor"
            onChange={this.onEditorChange}
            value={this.state.editorValue}
            editorProps={{ $blockScrolling: false }}
            setOptions={{ useWorker: false }}
            width={this.state.editorWidth + "px"}
            height={this.state.editorHeight + "px"}
          />
        </div>
      </div>
    );
  }
}
