var a = 64;
var b = 64;
var c = 64;


for (var i = 0; i < 128; i++) {
  for (var j = 0; j < 128; j++) {
    for (var k = 0; k < 128; k++) {
        var color = (i + k) % 2 + 1;
        if (Math.pow((i - a), 2) + Math.pow((j - b), 2) + Math.pow((k - c), 2) < 30*30) {
            setBlock(color, i, j, k);
        }
    }
  }
}