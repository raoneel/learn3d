import { noa, DIM, CHUNK_SIZE } from "./noaSetup";
import { getNoaBlockId, getRandomColorId } from "./noaBlockSetup";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { hexToRgb } from "../util/utils";

export let chunkMap = new Map<string, any>();
let currentColorId = 0;
let currentTaskId = 0;

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
      noa.rendering._scene.clearColor = new Color3(parsedRGB.r / 255.0, parsedRGB.g / 255.0, parsedRGB.b / 255.0);
    }
  }

  function setColorWrapper(hexColor: string) {
    currentColorId = getNoaBlockId(hexColor);
  }

  function setRandomColorWrapper() {
    currentColorId = getRandomColorId();
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
}

export function runUserCode(userCode: string, onDone: () => void) {
  // Run interpreter
  // Reset all chunks in drawing scope to 0
  // Draw directly to array buffer
  // Set chunkData directly
  // Then invalidate all voxels (change world name)

  try {
    chunkMap.clear();
    //@ts-ignore
    var myInterpreter = new Interpreter(userCode, initFunc);

    // Task ID is used to cancel older tasks
    currentTaskId = Math.random();
    myInterpreter.taskId = currentTaskId;
    stepUntilDone(myInterpreter, onDone);
  } catch (e) {
    console.error(e);
  }
}

function stepUntilDone(interpreter: any, onDone: () => void) {
  let steps = 0;

  while (interpreter.step()) {
    interpreter.step();
    steps++;

    // If another task is started, cancel this task
    // TODO is there a race condition where the chunkMap isn't cleared properly?
    if (interpreter.taskId !== currentTaskId) {
      return;
    }

    // 70000 steps is just a guess for achieving ~45 FPS
    // TODO improve performance
    if (steps > 70000) {
      requestAnimationFrame(() => {
        stepUntilDone(interpreter, onDone);
      });
      return;
    }
  }

  // Invalidate chunks once the data is set
  noa.world.invalidateVoxelsInAABB({
    base: [0, 0, 0],
    max: [128, 128, 128],
  });

  onDone();
}

function worldCoordToChunkCoord(coord: number) {
  return Math.floor(coord / CHUNK_SIZE) | 0;
}

function worldCoordToChunkIndex(coord: number) {
  return ((coord % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE | 0;
}
