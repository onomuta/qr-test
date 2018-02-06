navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
var video = document.getElementById('video');
var localStream = null;

// リアカメラを使用.
//navigator.getUserMedia({video: true, audio: false},
navigator.getUserMedia(
    {
        audio: false,
        video: { facingMode: { exact: "environment" } }
    },
    function(stream) {
        // mobile safariでは動作しない.
        //window.URL = window.URL || window.webkitURL;
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        localStream = stream;
    },
    function(err) {
        console.log(err);
    }
);

function decodeImageFromBase64(data, callback){
    qrcode.callback = callback;
    qrcode.decode(data)
}

  
function loop(){
// document.getElementById("action").addEventListener('click', function() {
  if(localStream) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('img');

    //videoの縦幅横幅を取得
    // var w = video.offsetWidth;
    var w = video.offsetWidth/1.8; //縦横比修正
    var h = video.offsetHeight;

    //同じサイズをcanvasに指定
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);

    //canvasにコピー
    ctx.drawImage(video, 0, 0, w, h);

    decodeImageFromBase64(canvas.toDataURL('image/png'), function(result) {
      if(result == "error decoding QR Code"){

      }else{
        alert(result);
      }          
      
    });
  };
// },false);


class BarcodeReader {
  constructor() {
    Quagga.onProcessed(this._onProcessed.bind(this));
    Quagga.onDetected(this._onDetected.bind(this));
  }

  get config() {
    return {
      inputStream: {
        target: '#preview',
        size: 640,
        singleChannel: false
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      decoder: {
        readers: [{
          format: "code_128_reader",
          config: {}
        }]
      },
      numOfWorker: navigator.hardwareConcurrency || 1,
      locate: true,
      src: null
    };
  }

  
  decode(src) {
    const config = Object.assign({}, this.config, { src: src });

    return new Promise((resolve, reject) => {
      Quagga.decodeSingle(config, result => {
        resolve(result);
      });
    })
  }

  /** 処理が完了したときに実行される*/
  _onProcessed(data) {
    console.log('onProccessed', data);
    const ctx = Quagga.canvas.ctx.overlay;
    const canvas = Quagga.canvas.dom.overlay;
		if (!data) { return; }
    // 認識したバーコードを囲む
    if (data.boxes) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hasNotRead = box => box !== data.box;
      data.boxes.filter(hasNotRead).forEach(box => {
        Quagga.ImageDebug.drawPath(box, {x:0, y:1}, ctx, {color: 'green', lineWidth: 2});
      });
    }
    if (data.box) {
      Quagga.ImageDebug.drawPath(data.box, {x:0, y:1}, ctx, {color: 'blue', lineWidth: 2});
    }
    if (data.codeResult && data.codeResult.code) {
      Quagga.ImageDebug.drawPath(data.line, {x:'x', y:'y'}, ctx, {color: 'red', lineWidth: 3});
    }
  }

  /**
   * バーコード読み取りが成功したときに実行される
   */
  _onDetected(data) {
    alert(data);
  }
  
  getDataURL() {
    return Quagga.canvas.dom.image.toDataURL();
  }
}

}

setInterval(loop,200);




