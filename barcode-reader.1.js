// import Quagga.js

class BarcodeReader {
  constructor() {
    Quagga.onProcessed(this._onProcessed.bind(this));
    Quagga.onDetected(this._onDetected.bind(this));
  }

  get config() {
    return {
      // イメージソースの定義
      inputStream: {
        // イメージを表示する場所（デフォルトはid="interactive"）
        target: '#preview',
        // Canvasのサイズ
        size: 640,
        singleChannel: false
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      // バーコードの種類
      decoder: {
        readers: [{
          format: "code_39_reader",
          // format: "code_128_reader",
          config: {}
        }]
      },
      // Web Workerの数
      numOfWorker: navigator.hardwareConcurrency || 4,
      // 画像内にバーコードを表示させる？
      locate: true,
      src: null
    };
  }

  /**
   * バーコードを読み込む
   * @param {DOMString} src イメージソース
   */
  decode(src) {
    const config = Object.assign({}, this.config, { src: src });

    return new Promise((resolve, reject) => {
      Quagga.decodeSingle(config, result => {
        resolve(result);
      });
    })
  }
  /**
   * 処理が完了したときに実行される
   */
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

    // 読み取ったバーコードを囲む
    if (data.box) {
      Quagga.ImageDebug.drawPath(data.box, {x:0, y:1}, ctx, {color: 'blue', lineWidth: 2});
    }
    
    // 読み取ったバーコードに線を引く
    if (data.codeResult && data.codeResult.code) {
      Quagga.ImageDebug.drawPath(data.line, {x:'x', y:'y'}, ctx, {color: 'red', lineWidth: 3});
    }
  }

  /**
   * バーコード読み取りが成功したときに実行される
   */
  _onDetected(data) {
    console.log('onDetected', data);
  }
 
  getDataURL() {
    return Quagga.canvas.dom.image.toDataURL();
  }
}

function main() {
  var canvas1 = document.getElementById('c1');
  if ( ! canvas1 || ! canvas1.getContext ) { return false; }
  var ctx = canvas1.getContext('2d');
  /* Imageオブジェクトを生成 */
  var img = new Image();
  img.src = "img/code_39.png?" + new Date().getTime();
  /* 画像が読み込まれるのを待ってから処理を続行 */
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  }

  
  const barcodeReader = new BarcodeReader();
    // const file = e.target.files[0];    

    // /***
    // canvas に絵を書くコード
    // ***/
    var type = 'image/jpeg';
    // canvas から DataURL で画像を出力
    var dataurl = canvas1.toDataURL(type);
    // DataURL のデータ部分を抜き出し、Base64からバイナリに変換
    var bin = atob(dataurl.split(',')[1]);
    // 空の Uint8Array ビューを作る
    var buffer = new Uint8Array(bin.length);
    // Uint8Array ビューに 1 バイトずつ値を埋める
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    // Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
    var blob = new Blob([buffer.buffer], {type: type});
    
    const src = window.URL.createObjectURL(blob);
    
    console.log("///blob");
    console.log(blob);

    console.log("///src");
    console.log(src);

    const result = barcodeReader.decode(src);

    console.log("///result");
    console.log(result);
  
    // document.getElementById('result').value = result.codeResult.code;
}

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
