for (var i = 0 ; i < 128; i++) {
    for (var j = 0; j < 128; j++) {
        var y = Math.sin(i / 10) * 5 + Math.sin(j / 10) * 10 + 30;
        setBlock(i, y ,j);
    }
}