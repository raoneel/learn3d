/*
 *
 *          noa hello-world example
 *
 *  This is a bare-minimum example world, intended to be a
 *  starting point for hacking on noa game world content.
 *
 */

// Engine options object, and engine instantiation:
import Engine from "noa-engine";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {chunkMap} from "./worldGen";
export let noa;

export const DIM = 128;
export const CHUNK_SIZE = 32;

export function initNoa() {
  var opts = {
    debug: true,
    showFPS: true,
    chunkSize: CHUNK_SIZE,
    chunkAddDistance: 6.5,
    chunkRemoveDistance: 7.5,
    domElement: document.getElementById("NoaContainer"),
    // See `test` example, or noa docs/source, for more options
  };

  noa = new Engine(opts);

  /*
   *
   *      Registering voxel types
   *
   *  Two step process. First you register a material, specifying the
   *  color/texture/etc. of a given block face, then you register a
   *  block, which specifies the materials for a given block type.
   *
   */

  // block materials (just colors for this demo)
  var textureURL = null; // replace that with a filename to specify textures
  var brownish = [0.45, 0.36, 0.22];
  var greenish = [0.1, 0.8, 0.2];
  noa.registry.registerMaterial("dirt", brownish, textureURL);
  noa.registry.registerMaterial("grass", greenish, textureURL);

  // block types and their material names
  var dirtID = noa.registry.registerBlock(1, { material: "dirt" });
  var grassID = noa.registry.registerBlock(2, { material: "grass" });

  /*
   *
   *      World generation
   *
   *  The world is divided into chunks, and `noa` will emit an
   *  `worldDataNeeded` event for each chunk of data it needs.
   *  The game client should catch this, and call
   *  `noa.world.setChunkData` whenever the world data is ready.
   *  (The latter can be done asynchronously.)
   *
   */

  function getVoxelID(x, y, z) {
    if (x >= DIM || x < 0) {
      return 0;
    }

    if (z >= DIM || z < 0) {
      return 0;
    }

    if (y < -1) {
      return 0;
    }

    if (y === -1) {
      return grassID;
    }

    return 0;
  }

  // register for world events
  noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
    // If chunk ID exists, then return from cache, otherwise run loop
    // console.log(id);
    if (chunkMap.has(id)) {
      let chunkData = chunkMap.get(id);
      data.data.set(chunkData.data);
      noa.world.setChunkData(id, data);
      return;
    }

    // `id` - a unique string id for the chunk
    // `data` - an `ndarray` of voxel ID data (see: https://github.com/scijs/ndarray)
    // `x, y, z` - world coords of the corner of the chunk
    for (var i = 0; i < data.shape[0]; i++) {
      for (var j = 0; j < data.shape[1]; j++) {
        for (var k = 0; k < data.shape[2]; k++) {
          var voxelID = getVoxelID(x + i, y + j, z + k);
          data.set(i, j, k, voxelID);
        }
      }
    }
    // tell noa the chunk's terrain data is now set
    noa.world.setChunkData(id, data);
  });

  /*
   *
   *      Create a mesh to represent the player:
   *
   */

  // get the player entity's ID and other info (position, size, ..)
  var player = noa.playerEntity;
  var dat = noa.entities.getPositionData(player);
  var w = dat.width;
  var h = dat.height;

  // add a mesh to represent the player, and scale it, etc.
  var scene = noa.rendering.getScene();
  var mesh = Mesh.CreateBox("player-mesh", 1, scene);
  mesh.scaling.x = w;
  mesh.scaling.z = w;
  mesh.scaling.y = h;

  // add "mesh" component to the player entity
  // this causes the mesh to move around in sync with the player entity
  noa.entities.addComponent(player, noa.entities.names.mesh, {
    mesh: mesh,
    // offset vector is needed because noa positions are always the
    // bottom-center of the entity, and Babylon's CreateBox gives a
    // mesh registered at the center of the box
    offset: [0, h / 2, 0],
  });

  /*
   *
   *      Minimal interactivity
   *
   */

  // clear targeted block on on left click
  noa.inputs.down.on("fire", function () {
    if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
  });

  // place some grass on right click
  noa.inputs.down.on("alt-fire", function () {
    if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent);
  });

  // add a key binding for "E" to do the same as alt-fire
  noa.inputs.bind("alt-fire", "E");

  // each tick, consume any scroll events and use them to zoom camera
  noa.on("tick", function (dt) {
    var scroll = noa.inputs.state.scrolly;
    if (scroll !== 0) {
      noa.camera.zoomDistance += scroll > 0 ? 1 : -1;
      if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0;
      if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10;
    }
  });
}
