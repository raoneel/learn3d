import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "./CodeEditor.scss";
import { noa } from "../noa/noaSetup";

const DEFAULT_CODE =
`for (var i = 0; i < 128; i++) {
  for (var k = 0; k < 128; k++) {
    if (Math.random() > 0.2) {
      setBlock(2, i, 1, k);
    }
  }
}`;

export interface CodeEditorProps {}

export interface CodeEditorState {}

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
  editorCode: string = DEFAULT_CODE;

  constructor(props: CodeEditorProps) {
    super(props);

    this.state = {};
  }

  onClickRun = () => {
    if (noa) {
      noa.world.invalidateVoxelsInAABB({
        base: [0, 0, 0],
        max: [128, 128, 128]
      })
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
        var myInterpreter = new Interpreter(this.editorCode, initFunc);
        myInterpreter.run();
      } catch(e) {
        console.error(e);
      }

    }, 5000);
  };

  onEditorChange = (newValue: string, event: any) => {
    this.editorCode = newValue;
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }

  public render() {
    return (
      <div onKeyDown={this.onKeyDown} className="CodeEditor" id="CodeEditor">
        <div className="CodeEditor-Header">
          <button onClick={this.onClickRun}>Run</button>
        </div>
        <AceEditor
          className="CodeEditor-Editor"
          mode="javascript"
          theme="monokai"
          name="CodeEditor"
          onChange={this.onEditorChange}
          defaultValue={DEFAULT_CODE}
          editorProps={{ $blockScrolling: false }}
          setOptions={{ useWorker: false }}
        />
      </div>
    );
  }
}
