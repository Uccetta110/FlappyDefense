import { Objects } from "./objects.js";
export const Functions = {
  setPath_lvl1: function (GRID_HEIGHT) {
    let path = [];
    let x = 0;
    let y = Math.floor((GRID_HEIGHT * 10) / 13);
    path.push({ x, y });

    // 5 passi a destra
    for (let i = 0; i < 5; i++) {
      x++;
      path.push({ x, y });
    }

    // 3 passi in giù
    for (let i = 0; i < 2; i++) {
      y--;
      path.push({ x, y });
    }

    // 3 passi a sinistra
    for (let i = 0; i < 3; i++) {
      x++;
      path.push({ x, y });
    }

    // 2 passi in giù
    for (let i = 0; i < 2; i++) {
      y--;
      path.push({ x, y });
    }

    // 4 passi a destra
    for (let i = 0; i < 5; i++) {
      x++;
      path.push({ x, y });
    }

    // 3 passi in giù
    for (let i = 0; i < 3; i++) {
      y++;
      path.push({ x, y });
    }

    for (let i = 0; i < 2; i++) {
      x--;
      path.push({ x, y });
    }
    for (let i = 0; i < 2; i++) {
      y++;
      path.push({ x, y });
    }
    for (let i = 0; i < 5; i++) {
      x++;
      path.push({ x, y });
    }
    for (let i = 0; i < 7; i++) {
      y--;
      path.push({ x, y });
    }
    for (let i = 0; i < 9; i++) {
      x--;
      path.push({ x, y });
    }
    for (let i = 0; i < 3; i++) {
      y--;
      path.push({ x, y });
    }
    for (let i = 0; i < 13; i++) {
      x++;
      path.push({ x, y });
    }
    for (let i = 0; i < 9; i++) {
      y++;
      path.push({ x, y });
    }
    for (let i = 0; i < 3; i++) {
      x++;
      path.push({ x, y });
    }
    for (let i = 0; i < 3; i++) {
      y--;
      path.push({ x, y });
    }
    for (let i = 0; i < 2; i++) {
      x++;
      path.push({ x, y });
    }
    x++;
    path.push({ x, y });
    x++;
    path.push({ x, y });
    return path;
  },
  setDrawPath_lvl1: function (drawPathTile, gameState) {
    console.log("setDrawPath start");
    drawPathTile(gameState.path[0], Objects.tiles[5]);
    drawPathTile(gameState.path[1], Objects.tiles[13]);
    drawPathTile(gameState.path[2], Objects.tiles[18]);
    drawPathTile(gameState.path[3], Objects.tiles[3]);
    drawPathTile(gameState.path[4], Objects.tiles[22]);
    drawPathTile(gameState.path[5], Objects.tiles[27]); // turn left
    drawPathTile(gameState.path[6], Objects.tiles[59]);

    drawPathTile(gameState.path[7], Objects.tiles[5]);

    drawPathTile(gameState.path[8], Objects.tiles[35]);
    drawPathTile(gameState.path[9], Objects.tiles[29]);
    drawPathTile(gameState.path[10], Objects.tiles[41]);
    drawPathTile(gameState.path[11], Objects.tiles[43]);
    drawPathTile(gameState.path[12], Objects.tiles[5]);
    drawPathTile(gameState.path[13], Objects.tiles[4]);

    console.log("setDrawPath end");
  },
  setDrawMapObjects_lvl1: function (drawDetail, addAnimatedObject, TILE_SIZE) {
    console.log("setDrawMapObjects start");

    drawDetail(120, 260, Objects.bush[5] /*true*/);
    drawDetail(121, 264, Objects.flower[5], false);
    //drawDetail(341 - 5, 455 + 30, Objects.shadow[0], true);
    drawDetail(499, 663, Objects.lamp[0] /*true*/);
    drawDetail(11 * TILE_SIZE + 1, 9 * TILE_SIZE - 18, Objects.fence[0], false);
    drawDetail(
      11 * TILE_SIZE + 32,
      9 * TILE_SIZE - 18,
      Objects.fence[0],
      false
    );
    drawDetail(121, 376, Objects.lamp[4] /*true*/);

    drawDetail(69, 93, Objects.camp[3] /*true*/);

    //drawDetail(25, 122, Objects.log[1], /*true*/);
    addAnimatedObject(25, 76, Objects.campfire_off, 35);
    //
    addAnimatedObject(1405, 147, Objects.flag.front_left, 30);
    //addAnimatedObject(91, 168, Objects.flag.front_right, 30);

    drawDetail(91, 188, Objects.pointer[4] /*true*/);

    console.log("setDrawMapObjects end");
  },
  setDrawShadows_lvl1: function (drawDetail) {
    drawDetail(499 - 5, 663 + 25, Objects.shadow[0], false);
    drawDetail(121, 376, Objects.shadow[0], true);
    drawDetail(69, 95, Objects.shadow[4] /*true*/);
    drawDetail(1405 + 3, 147 + 50, Objects.shadow[1] /*true*/);
    drawDetail(91, 188, Objects.shadow[1] /*true*/);
    drawDetail(25, 76 + 48, Objects.shadow[1] /*true*/);
  },
};
