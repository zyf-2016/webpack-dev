// let $ = require('jquery')
let Hogan = require('hogan.js')
let conf = {
  serverHost: ''
}
let global = {
  request: function(param) {
    var that = this;
    $.ajax({
      type: param.method || 'get',
      url: param.url || '',
      datatype: param.type || 'json',
      data: param.data || '',
      success: function(res) {
        //请求成功
        if(res.status === 0) {
          typeof param.success === 'function' && param.success(res.data, res.mag);
        }
        //没有登录状态，需要强制登录
        else if(res.status === 10) {
          that.doLogin();
        }
        //请求数据错误
        else if(res.status === 1) {
          typeof param.error === 'function' && param.error(res.err);
        }
      },
      error: function(err) {
        typeof param.error === 'function' && param.error(err.statusText);
      }
    });
  },
  // 获取服务器地址
  getServerUrl: function(path) {
    return conf.serverHost + path
  },
  //获取url参数
  getUrlParam: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var result = window.location.search.substring(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
  },
  //渲染html模板
  renderHtml: function(htmlTemplate, data) {
    var template = Hogan.compile(htmlTemplate),
    result =  template.render(data);
    return result;
  },
  successTips: function(msg) {
    alert(msg || '操作成功');
  },
  errorTips: function(msg) {
    alert(msg || '操作失败');
  },
  validate: function(value,type) {
    let _value = $.trim(value);
    // 非空验证
    if(type === 'required') {
      return !!_value;
    }
    // 手机号验证
    if(type === 'phone') {
      return /^1[3|4|5|7|8]\d{9}&/.test(_value);
    }
    //邮箱验证
    if(type === 'email') {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(_value);
    }
  },
  doLogin: function() {
    window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
  },
  goHome: function() {
    window.location.href = './login.html';
  }
}
module.exports = global