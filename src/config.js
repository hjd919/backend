// 根据环境切换
let domain;
if (process.env.NODE_ENV == 'development') {
  domain = 'http://127.0.0.1:9010';
} else {
  domain = 'http://jsapi.yz210.com';
}

export default {
  domain,
};
