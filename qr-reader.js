navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
var video = document.getElementById('video');
var localStream = null;
// リアカメラを使用.
navigator.getUserMedia(
  {
    audio: false,
    video: { facingMode: { exact: "environment" } }
  },
  function(stream) {
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
  if(localStream) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
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
      // エラーを除きたい..
      if(result == "error decoding QR Code"){
      }else{
        var e = document.getElementById('result');
        e.textContent = result;
      }          
    });
  };
}
//0.2秒ごとに読み込み
setInterval(loop,200);
