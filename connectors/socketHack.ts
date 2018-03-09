var request = require("request");
const requestP = require("request-promise-native");

var options = {
    method: 'POST',
    url: 'http://amdc.m.taobao.com/amdc/mobileDispatch',
    qs: {
        v: '3.1',
        appkey: 'umeng:57371764e0f55ab3200018ce',
        deviceId: '',
        platform: 'android'
    },
    headers: {
        connection: 'close',
        'accept-encoding': 'gzip',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Pixel 2 XL Build/OPM1.171019.018)',
        'content-length': '247'
    },
    body: 'lng=0.0&netType=WIFI&bssid=58%3Aef%3A68%3A26%3A96%3A40&sign=95ff66f478e2f636ebcb3da9d405b88c4efba8a273e3b6e9a10aaa0197492744&cv=-1&t=1519390870282&preIp=&platformVersion=8.1.0&domain=amdc.m.taobao.com%20umengacs.m.taobao.com&signType=noSec&lat=0.0'
};

let lightOffBody = "lng=0.0&netType=WIFI&bssid=58%3Aef%3A68%3A26%3A96%3A40&sign=95ff66f478e2f636ebcb3da9d405b88c4efba8a273e3b6e9a10aaa0197492744&cv=-1&t=1519390870282&preIp=&platformVersion=8.1.0&domain=amdc.m.taobao.com%20umengacs.m.taobao.com&signType=noSec&lat=0.0";
let lightOnBody = "lng=0.0&netType=WIFI&bssid=58%3Aef%3A68%3A26%3A96%3A40&sign=f03e11be2b89fca7b1b1267cbbcd48ffb42164ca4312b7362515697f901ad93e&cv=-1&t=1519390867279&preIp=&platformVersion=8.1.0&domain=umengjmacs.m.taobao.com&signType=noSec&lat=0.0";

let lightOffResp = "eyJjb2RlIjoxMDAwLCJjdiI6LTEsImRucyI6W3siYWlzbGVzIjpbeyJjdG8iOjEwMDAwLCJoZWFydGJlYXQiOjAsInBvcnQiOjQ0MywicHJvdG9jb2wiOiJodHRwcyIsInJldHJ5IjoxLCJydG8iOjEwMDAwfSx7ImN0byI6MTAwMDAsImhlYXJ0YmVhdCI6MCwicG9ydCI6ODAsInByb3RvY29sIjoiaHR0cCIsInJldHJ5IjoxLCJydG8iOjEwMDAwfV0sImhvc3QiOiJhbWRjLm0udGFvYmFvLmNvbSIsImlkYyI6dHJ1ZSwiaXBzIjpbIjQ3Ljg5Ljc2LjEwIiwiNDcuODkuNzYuNzMiXSwiaXNIb3QiOjEsInNhZmVBaXNsZXMiOiJodHRwIiwic3RyYXRlZ2llcyI6W10sInR0bCI6MzAwfSx7ImFpc2xlcyI6W3siYXV0aCI6MSwiY3RvIjoxMDAwMCwiaGVhcnRiZWF0Ijo0NTAwMCwicG9ydCI6NDQzLCJwcm90b2NvbCI6Imh0dHAyIiwicHVibGlja2V5IjoiYWNzIiwicmV0cnkiOjEsInJ0byI6MTAwMDAsInJ0dCI6IjBydHQifSx7ImF1dGgiOjEsImN0byI6MTAwMDAsImhlYXJ0YmVhdCI6NDUwMDAsInBvcnQiOjgwLCJwcm90b2NvbCI6Imh0dHAyIiwicHVibGlja2V5IjoiYWNzIiwicmV0cnkiOjEsInJ0byI6MTAwMDAsInJ0dCI6IjBydHQifSx7ImF1dGgiOjEsImN0byI6MTAwMDAsImhlYXJ0YmVhdCI6NDUwMDAsInBvcnQiOjQ0MywicHJvdG9jb2wiOiJzcGR5IiwicHVibGlja2V5IjoiYWNzIiwicmV0cnkiOjEsInJ0byI6MTAwMDAsInJ0dCI6IjBydHQifSx7ImF1dGgiOjEsImN0byI6MTAwMDAsImhlYXJ0YmVhdCI6NDUwMDAsInBvcnQiOjgwLCJwcm90b2NvbCI6InNwZHkiLCJwdWJsaWNrZXkiOiJhY3MiLCJyZXRyeSI6MSwicnRvIjoxMDAwMCwicnR0IjoiMHJ0dCJ9LHsiY3RvIjoxMDAwMCwiaGVhcnRiZWF0IjowLCJwb3J0Ijo0NDMsInByb3RvY29sIjoiaHR0cHMiLCJyZXRyeSI6MSwicnRvIjoxMDAwMH1dLCJob3N0IjoidW1lbmdhY3MubS50YW9iYW8uY29tIiwiaHJJbnRlcnZhbFRpbWUiOjg2NDAwMDAwLCJock51bSI6MiwiaHJTdHJhdGVneSI6InNlcmlhbENvbm4iLCJoclVybFBhdGgiOiJzdGF0dXMudGFvYmFvIiwiaWRjIjp0cnVlLCJpcHMiOlsiMTA2LjExLjYxLjEwNiIsIjE0MC4yMDUuMTYwLjc2Il0sImlzSG90IjoxLCJwYXJhbGxlbENvbk51bSI6Miwic2FmZUFpc2xlcyI6Imh0dHBzIiwic3RyYXRlZ2llcyI6W10sInR0bCI6MzYwMH1dLCJpcCI6IjE3MC4yMjYuMjEuODAifQ==";
//let lightOnResp = ;

options.body = lightOffBody;
options.headers['content-length'] = options.body.length;
requestP(options).then((response)=>{
  console.log(response);
}).catch((err)=>{
  console.log(err);
})
