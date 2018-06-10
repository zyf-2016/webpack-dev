require('styles/index')
require('../../../node_modules/font-awesome/css/font-awesome.min.css')
let html = '<div>{{data}}<div>'
let data = {
  data: 999
}
const format = require('utils/format')
const log = require('log')
const global = require('utils/global')
global.request({
  url: '/api/list.do?keyword=1',
  success: function(res) {
    console.log(res)
  },
  error: function(err) {
    console.log(err)
  }
});
console.log(global.renderHtml(html,data));

// log(global.getUrlParam('product'))

log(format('hello world'))

log(_.map([1, 2, 3], (item) => item * 2))

/* eslint-disable-next-line */
log(TWO)
/* eslint-disable-next-line */
log(CONSTANTS.APP_VERSION)
