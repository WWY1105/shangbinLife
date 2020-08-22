// pages/index/index.js
var QRCode = require('../../utils/weapp-qrcode.js')
var qrcode;

Page({
  data: {
    text: 'https://github.com/tomfriwel/weapp-qrcode',
    image: ''
  },
  onLoad: function (options) {
    qrcode = new QRCode('canvas', {
      // usingIn: this,
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      width: 150,
      height: 150,
      colorDark: "#000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },
  confirmHandler: function (e) {
    console.log(111)
    var value = e.detail.value
    qrcode.makeCode(value)
  },
  inputHandler: function (e) {
    console.log(112222)
    var value = e.detail.value
    this.setData({
      text: value
    })
  },
  tapHandler: function () {
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.text)
  },
  
})