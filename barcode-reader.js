
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
    readers : ["ean_reader"]
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
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
      });
    }

    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
    }



    if (!result.codeResult) {
      
    }else{
      console.log(result.codeResult.code);
      alert(result.codeResult.code);
    }




  }

 


});








// Quagga.decodeSingle({
//   decoder: {
//       readers: ["code_128_reader"] // List of active readers
//   },
//   locate: true, // try to locate the barcode in the image
//   src: 'img/code_128.gif' // or 'data:image/jpg;base64,' + data
// }, function(result){

//   if(result.codeResult) {
//       console.log("result", result.codeResult.code);
//   } else {
//       console.log("not detected");
//   }
// });



// onload = function() {
//   draw();
// };
// function draw() {
//   var canvas = document.getElementById('c1');
//   if ( ! canvas || ! canvas.getContext ) { return false; }
//   var ctx = canvas.getContext('2d');
//   /* Imageオブジェクトを生成 */
//   var img = new Image();
//   img.src = "img/code_39.png?" + new Date().getTime();
//   /* 画像が読み込まれるのを待ってから処理を続行 */
//   img.onload = function() {
//     ctx.drawImage(img, 0, 0);
//   }
// }




