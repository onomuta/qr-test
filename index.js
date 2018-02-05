// const medias = {audio : false, video : {
//   facingMode : {
//     exact : "environment"
//   }
// }},
// video  = document.getElementById("video"),
// canvas = document.getElementById("canvas"),
// ctx    = canvas.getContext("2d");

// navigator.getUserMedia(medias, successCallback, errorCallback);

// requestAnimationFrame(draw);

// function successCallback(stream) {
// video.srcObject = stream;
// };

// function errorCallback(err) {
// alert(err);
// };

// function draw() {
// canvas.width  = window.innerWidth;
// canvas.height = window.innerHeight;
// ctx.drawImage(video, 0, 0);

// requestAnimationFrame(draw);
// }





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

  document.getElementById("action").addEventListener('click', function() {
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
              alert(result);
          });
      }
  },false);