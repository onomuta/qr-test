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
    numOfWorkers:10,
    // frequency: 10,
    area: { // defines rectangle of the detection/localization area
      top: "30%",    // top offset
      right: "10%",  // right offset
      left: "10%",   // left offset
      bottom: "30%"  // bottom offset
    },
    // singleChannel: false // true: only the red color-channel is read

  },
  decoder : {
    //ここで読み込むバーコードの種類を指定。（複数可）
    readers : ["ean_reader"],
    // readers : ["code_128_reader"]    
    // multiple:false
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

  var canvasWidth = drawingCanvas.getAttribute("width");
  var canvasHeight = drawingCanvas.getAttribute("height");

  
  if (result) {
    // 　バーコードっぽいところに緑色の枠を出す
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
      });      
    }

    // 読み込めたバーコードに青い枠を出す
    if (result.box) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
    }
    // 読み取り結果 & 読み込めたバーコードに赤い線を引く
    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
      console.log(result.codeResult.code);
      alert(result.codeResult.code);
    }
  }

  var c=document.getElementById("drawingBuffer");
  var ctx=c.getContext("2d");

  drawingCtx.beginPath();
  drawingCtx.lineWidth="4";
  drawingCtx.strokeStyle="#ffcc00";
  
  // drawingCtx.rect(canvasWidth/2 - 200 ,canvasHeight/2 -70, 400, 140);

  drawingCtx.moveTo(0          , canvasHeight/3);
  drawingCtx.lineTo(canvasWidth, canvasHeight/3);

  drawingCtx.moveTo(0          , canvasHeight - canvasHeight/3);
  drawingCtx.lineTo(canvasWidth, canvasHeight - canvasHeight/3);


  drawingCtx.stroke();

});


