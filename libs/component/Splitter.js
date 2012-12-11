//横向分割栏
define(function(require, exports, module){
  'use strict';
  var opacity = require('./opacity');

  function Splitter () {

    var _leftContainer = null;
    var _splitter = null;
    var _rightContainner = null;
    var _maxLeft;
    var _maxRight;
    var _lastClientX;        //click的时候记录当前的clientx
    var _leftWidth;          //记录当前左侧容器的宽度

    this.init = function(config) {
      try {
        _leftContainer = $('#' + config.left);
        _rightContainner = $('#' + config.right);
        _splitter = $('#' + config.splitter);
      } catch (err) {
        console.error('Splitter.init() id= ' + config.splitter + ' Error: ' + err);
      }
      if (!_leftContainer || !_rightContainner || !_splitter) {
        console.error('Splitter.init() id= ' + config.splitter + ' Error');
      }
      _maxLeft = config.max_left;
      _maxRight = config.max_right;
      //分割DIV绑定事件
      //TODO 增加一个透明层
      _splitter.bind("mousedown", start);
    };

    //
    function start(event) {
      _lastClientX = event.clientX;
      _leftWidth = _leftContainer.width();
      opacity.show();
      _splitter.addClass('active');
      document.onmousemove = move;
      document.onmouseup = end;
    }

    //
    function move(evt) {
      evt = evt ? evt : window.event;
      var curClientX = evt.clientX;

      var curWidth = _leftWidth + curClientX - _lastClientX;

      _leftContainer.css('width', curWidth + "px"); 

      var nowWidth = _leftContainer.width();
      _rightContainner.css('left', nowWidth+ "px");
      _splitter.css('left', nowWidth + "px");
    }

    //
    function end(evt) {
      opacity.remove();
      document.onmousemove = null; 
      document.onmouseup= null
      _splitter.removeClass('active');
    }
  };

  module.exports = Splitter;
})