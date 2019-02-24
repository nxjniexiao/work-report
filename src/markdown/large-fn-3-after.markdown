首先给出 Function.prototype.after 方法：
+ 接受一个函数 fn 作为参数，返回一个函数；
+ 此函数先执行函数自身
   + 能处理，返回运行结果；
   + 不能处理(返回 ‘NEXT_NODE’)，则返回 fn 的运行结果。

```js
Function.prototype.after = function(fn) {
  var _self = this;
  return function() {
    var ret = _self.apply(this, arguments);
    if (ret === 'NEXT_NODE') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
};
```