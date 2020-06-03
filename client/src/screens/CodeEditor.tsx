import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "./CodeEditor.scss";
import { noa } from "../noa/noaSetup";
import ReactResizeDetector from "react-resize-detector";

const DEFAULT_CODE = `for (var i = 0; i < 128; i++) {
  for (var k = 0; k < 128; k++) {
    if (Math.random() > 0.2) {
      setBlock(2, i, 1, k);
    }
  }
}`;

export interface CodeEditorProps {}

export interface CodeEditorState {
  editorWidth: number;
  editorHeight: number;
  editorValue: string;
}

interface JSInterpreter {}

const initFunc = function (interpreter: any, globalObject: any) {
  function wrapper(id: number, x: string, y: string, z: string) {
    if (noa) {
      noa.setBlock(id, x, y, z);
    }
  }

  interpreter.setProperty(
    globalObject,
    "setBlock",
    interpreter.createNativeFunction(wrapper)
  );
};

export default class CodeEditor extends React.PureComponent<
  CodeEditorProps,
  CodeEditorState
> {
  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {
      editorHeight: 500,
      editorWidth: 500,
      editorValue: DEFAULT_CODE
    };
  }

  onClickRun = () => {
    if (noa) {
      noa.world.invalidateVoxelsInAABB({
        base: [0, 0, 0],
        max: [128, 128, 128],
      });
      // noa.worldName = Math.random() + "";
    }

    // Run interpreter
    // Reset all chunks in drawing scope to 0
    // Draw directly to array buffer
    // Set chunkData directly
    // Then invalidate all voxels (change world name)

    setTimeout(() => {
      try {
        //@ts-ignore
        var myInterpreter = new Interpreter(this.state.editorValue, initFunc);
        myInterpreter.run();
      } catch (e) {
        console.error(e);
      }
    }, 5000);
  };

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
