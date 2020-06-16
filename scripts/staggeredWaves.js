var j, i;

for (j = 0; j <= 100; j++) {
  for (i = 0; i <= 100; i++) {
    setRandomColor();
    setBlock((50 + Math.sin(((i + j) * 10) / 180 * Math.PI) * 5), i, j);
  }
}