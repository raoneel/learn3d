import { noa, DIM, CHUNK_SIZE } from "./noaSetup";
import { getNoaBlockId, getRandomColorId, GRASS_ID } from "./noaBlockSetup";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { hexToRgb } from "../util/utils";
import { store } from "../redux/store";
import {
  addConsoleMessage,
  clearConsole,
} from "../redux/actions/consoleActions";

export let chunkMap = new Map<string, any>();
let currentColorId = 0;
let currentTaskId = 0;
let numBlocks = 0;

function initFunc(interpreter: any, globalObject: any) {
  function setBlockWrapper(x: number, y: number, z: number) {
    if (noa) {
      // Ignore if block is set out of bounds
      if (
        x < 0 ||
        y < 0 ||
        z < 0 ||
        x > DIM - 1 ||
        y > DIM - 1 ||
        z > DIM - 1
      ) {
        return;
      }

      // Calculate chunkID based on x,y,z
      let chunkX = worldCoordToChunkCoord(x);
      let chunkY = worldCoordToChunkCoord(y);
      let chunkZ = worldCoordToChunkCoord(z);

      let innerChunkX = worldCoordToChunkIndex(x);
      let innerChunkY = worldCoordToChunkIndex(y);
      let innerChunkZ = worldCoordToChunkIndex(z);

      // TODO improve performance here if possible
      // Creating string every block set
      let chunkId = `${chunkX}|${chunkY}|${chunkZ}|default`;

      let chunkData;
      if (!chunkMap.has(chunkId)) {
        chunkData = noa.world.Chunk._createVoxelArray(CHUNK_SIZE);
        chunkMap.set(chunkId, chunkData);
      } else {
        chunkData = chunkMap.get(chunkId);
      }

      numBlocks++;
      // Get/set blockID on local ndarray
      chunkData.set(innerChunkX, innerChunkY, innerChunkZ, currentColorId);
    }
  }

  function setSkyColorWrapper(hexColor: string) {
    // Split hex color into r,g,b values
    let parsedRGB = hexToRgb(hexColor);

    if (!parsedRGB) {
      return;
    }

    // Set sky (clearColor)
    if (noa) {
      noa.rendering._scene.clearColor = new Color3(
        parsedRGB.r / 255.0,
        parsedRGB.g / 255.0,
        parsedRGB.b / 255.0
      );
    }
  }

  function logWrapper(message: string) {
    store.dispatch(addConsoleMessage(`${message}`));
  }

  function setColorWrapper(hexColor: string) {
    currentColorId = getNoaBlockId(hexColor);
  }

  function setRandomColorWrapper() {
    currentColorId = getRandomColorId();
  }

  function setTransparentWrapper() {
    currentColorId = 0;
  }

  interpreter.setProperty(
    globalObject,
    "setSkyColor",
    interpreter.createNativeFunction(setSkyColorWrapper)
  );

  interpreter.setProperty(
    globalObject,
    "setRandomColor",
    interpreter.createNativeFunction(setRandomColorWrapper)
  );

  interpreter.setProperty(
    globalObject,
    "setBlock",
    interpreter.createNativeFunction(setBlockWrapper)
  );

  interpreter.setProperty(
    globalObject,
    "setColor",
    interpreter.createNativeFunction(setColorWrapper)
  );

  interpreter.setProperty(
    globalObject,
    "log",
    interpreter.createNativeFunction(logWrapper)
  );

  interpreter.setProperty(
    globalObject,
    "setTransparent",
    interpreter.createNativeFunction(setTransparentWrapper)
  );
}

export function runUserCode(userCode: string, onDone: () => void) {
  // Clear console on new code run
  store.dispatch(clearConsole());
  store.dispatch(addConsoleMessage(`Running your code...`));

  // Reset block counter
  numBlocks = 0;

  // Default color is grass
  currentColorId = GRASS_ID;

  try {
    chunkMap.clear();
    //@ts-ignore
    var myInterpreter = new Interpreter(userCode, initFunc);

    // Task ID is used to cancel older tasks
    currentTaskId = Math.random();
    myInterpreter.taskId = currentTaskId;
    stepUntilDone(myInterpreter, onDone);
  } catch (e) {
    store.dispatch(addConsoleMessage(`💔 ${e.name}: ${e.message}`));
  }
}

function stepUntilDone(interpreter: any, onDone: () => void) {
  let steps = 0;

  try {
    while (interpreter.step()) {
      interpreter.step();
      steps++;

      // If another task is started, cancel this task
      // TODO is there a race condition where the chunkMap isn't cleared properly?
      if (interpreter.taskId !== currentTaskId) {
        return;
      }

      // 70000 steps is just a guess for achieving ~60 FPS
      // TODO improve performance, adjust based on timing
      if (steps > 60000) {
        setTimeout(() => {
          stepUntilDone(interpreter, onDone);
        }, 0);
        return;
      }
    }
  } catch (e) {
    // Display errors in console
    store.dispatch(addConsoleMessage(`💔 ${e.name}: ${e.message}`));
    return;
  }

  // Invalidate chunks once the data is set
  noa.world.invalidateVoxelsInAABB({
    base: [0, 0, 0],
    max: [128, 128, 128],
  });

  store.dispatch(clearConsole());
  store.dispatch(
    addConsoleMessage(`👍 Your code works! Created ${numBlocks} blocks.`)
  );
  onDone();
}

function worldCoordToChunkCoord(coord: number) {
  return Math.floor(coord / CHUNK_SIZE) | 0;
}

function worldCoordToChunkIndex(coord: number) {
  return ((coord % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE | 0;
}
