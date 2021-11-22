exports.wrapText = function(ctx, text, x, y, maxWidth, fontSize, fontFace){
    var words = text.split(' ');
    var line = '';
    var lineHeight = fontSize * 1.17;
  
    ctx.font=fontSize+" "+fontFace;
    ctx.textBaseline='top';
  
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if(testWidth >= maxWidth) {
        ctx.fillText(line, x, y);
        if(n<words.length-1){
            line = words[n] + ' ';
            y += lineHeight;
        }
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);

    return y;
  }