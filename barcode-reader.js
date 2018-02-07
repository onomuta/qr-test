Quagga.init({
  inputStream : {
    name : "Live",
    type : "LiveStream",
    target: document.querySelector('#c1'),    // Or '#yourElement' (optional)
    constraints: {
      width: {min: 640},
      height: {min: 480},
      aspectRatio: {min: 1, max: 100},
      // facingMode: "environment" // or "user" for the front camera
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
  },
  decoder : {
    // readers : ["ean_reader"]
    readers : ["code_128_reader"]    
  }
}, function(err) {
  if (err) {
    console.log(err);
    return
  }
  console.log("Initialization finished. Ready to start");
  Quagga.start();
});

// Make sure, QuaggaJS draws frames an lines around possible 
// barcodes on the live stream
Quagga.onProcessed(function(result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
  drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    // if (result.boxes) {
    //   drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    //   result.boxes.filter(function (box) {
    //     return box !== result.box;
    //   }).forEach(function (box) {
    //     Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
    //   });      
    // }

    if (result.box) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      
      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
    }
    // 読み取り結果
    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
      console.log(result.codeResult.code);
      alert(result.codeResult.code);
    }

  }

});