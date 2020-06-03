var a = 64;
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
