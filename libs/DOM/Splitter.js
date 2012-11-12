//分割
define(function(require, exports, module){
  var opacity = require('DOM/opacity');

  function Splitter () {

    var _leftContainer = null;
    var _splitter = null;
    var _rightContainner = null;
    var _maxLeft;
    var _maxRight;

    this.init = function(config) {
      try {
        _leftContainer = $('#' + config.left);
        _rightContainner = $('#' + config.right);
        _splitter = $('#' + config.splitter);
      } catch (err) {
        console.log('Splitter.init() id= ' + config.splitter + ' Error: ' + err);
      }
      if (!_leftContainer || !_rightContainner || !_splitter) {
        console.log('Splitter.init() id= ' + config.splitter + ' Error');
      }
      _maxLeft = config.max_left;
      _maxRight = config.max_right;
      //分割DIV绑定事件
      //TODO 增加一个透明层
      _splitter.bind("mousedown", start);
    };

    //
    function start(event) {
      opacity.show();
      _splitter.addClass('active');
      document.onmousemove = move;
      document.onmouseup = end;
    }

    //
    function move(evt) {
      evt = evt ? evt : window.event;
      var moveX = evt.clientX;
      console.log(moveX);
      console.log(_maxLeft);
      console.log(_maxRight);
      if (_maxLeft < moveX && moveX < ($(document).width() - _maxRight)) {
        _leftContainer.css('width', moveX + "px"); 
        _rightContainner.css('left', moveX+ "px");
        _splitter.css('left', moveX + "px");
      }
    }

    //
    function end(evt) {
      opacity.remove();
      document.onmousemove = null; 
      document.onmouseup= null
      _splitter.removeClass('active');
    }
  };

  module.exports = new Splitter();
})