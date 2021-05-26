const getCookie = function getCookie(name) {
  // 读取COOKIE
  if (typeof document === 'undefined') {
    return '';
  }
  var reg = new RegExp('(^| )' + name + '(?:=([^;]*))?(;|$)');
  var val = document.cookie.match(reg);
  // eslint-disable-next-line no-nested-ternary
  return val ? val[2] ? unescape(val[2]) : '' : null;
};

const setCookie = function setCookie(name, value) {
  var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var domain = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var secure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  // 写入COOKIES
  if (typeof document === 'undefined') {
    return '';
  }
  var exp = new Date();
  // eslint-disable-next-line no-unused-expressions
  expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires, 10)) : '';
  // @ts-ignore
  // eslint-disable-next-line prefer-template
  document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
};

const delCookie = function delCookie(name) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var domain = arguments[2];
  var secure = arguments[3];

  // 删除cookie
  if (typeof document === 'undefined') {
    return '';
  }
  var value = getCookie(name);
  if (value !== null) {
    var exp = new Date();
    exp.setMinutes(exp.getMinutes() - 1000);
    // @ts-ignore
    // eslint-disable-next-line prefer-template
    document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
  }
};

export {
  getCookie,
  setCookie,
  delCookie,
}
