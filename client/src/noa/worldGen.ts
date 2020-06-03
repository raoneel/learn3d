import { noa, DIM, CHUNK_SIZE } from "./noaSetup";

export let chunkMap = new Map<string, any>();

function initFunc(interpreter: any, globalObject: any) {
  function wrapper(id: number, x: number, y: number, z: number) {
    if (noa) {
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
      chunkData.set(innerChunkX, innerChunkY, innerChunkZ, id);
    }
  }

  interpreter.setProperty(
    globalObject,
    "setBlock",
    interpreter.createNativeFunction(wrapper)
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

    // 70000 steps is just a guess for achieving ~45 FPS
    // TODO improve performance
    if (steps > 70000) {
      requestAnimationFrame(() => {
        stepUntilDone(interpreter, onDone);
      })
      return;
    }

  }

  // console.log("Steps completed:", steps);

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
