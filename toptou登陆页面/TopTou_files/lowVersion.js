const lowVersionHtml = '\n' +
  '<!--Low Version-->\n' +
  '<div class="low-version" style="position: fixed;left: 50%;top: 200px;width: 500px;margin-left: -250px;text-align: center;">\n' +
  '  <img src="/img/low_version_update.png" alt="">\n' +
  '  <p style="margin-top: 24px;color: #6a74a5;font-weight: normal;font-size: 16px;">您当前使用的的浏览器版本过低<br>为了更好的体验，请使用最新Chrome、火狐等浏览器或极速模式访问TopTou</p>\n' +
  '  <p style="font-size: 12px;margin-top: 12px;color: #A1ACB0;">仅支持Chrome76, Safari12, Firefox59以上版本的浏览器</p>'+
  '  <p>\n' +
  '    <a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank" style="background: #52BE80;color: #FFF;display: block;height: 32px;font-weight: normal;padding: 0 16px;border-radius: 4px;margin: 24px auto 0;text-decoration: none;width: 120px;line-height: 32px;">下载Chrome</a>\n' +
  '  </p>\n' +
  '</div>'

/**
 * 获取浏览器版本详情
 * @return {RegExpMatchArray|string}
 */
function getBrowserInfo() {
  var agent = navigator.userAgent.toLowerCase();
  var regStr_ff = /firefox\/[\d.]+/gi;
  var regStr_chrome = /chrome\/[\d.]+/gi;
  var regStr_saf = /version\/([\d\.]+).*safari/;
  var isIE = agent.indexOf('compatible') > -1 && agent.indexOf('msie' > -1); //判断是否IE<11浏览器
  var isIE11 = agent.indexOf('trident') > -1 && agent.indexOf('rv:11.0') > -1;

  if (isIE) {
    var reIE = new RegExp('msie (\\d+\\.\\d+);');
    reIE.test(agent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion == 7) {
      return 'IE/7';
    } else if (fIEVersion == 8) {
      return 'IE/8';
    } else if (fIEVersion == 9) {
      return 'IE/9';
    } else if (fIEVersion == 10) {
      return 'IE/10';
    }
  } //isIE end
  if (isIE11) {
    return 'IE/11';
  }
  //firefox
  if (agent.indexOf('firefox') > 0) {
    return agent.match(regStr_ff);
  }
  //Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    return 'safari/' + agent.match(regStr_saf)[1];
  }
  //Chrome
  if (agent.indexOf('chrome') > 0) {
    return agent.match(regStr_chrome);
  }
}

/**
 * 如果是低版本的浏览器,就开启遮罩层
 */
function browserVersionCheck() {
  var browser = getBrowserInfo();
  var bName = (browser + '').replace(/[0-9./]/ig, '');
  //根据正则将所有非数字全部去掉，剩下版本
  var bVersion = parseInt((browser + '').replace(/[^0-9.]/ig, ''));
  console.log('浏览器版本:', bName, bVersion)
  if (
    bName == 'IE'
    || (bName == 'safari' && bVersion < 12)
    || (bName == 'chrome' && bVersion < 76)
    || (bName == 'firefox' && bVersion < 59)
    || bName == 'world'
  ) {
    document.body.innerHTML = lowVersionHtml
    // document.body.insertAdjacentHTML(lowVersionHtml)
  }
}

browserVersionCheck()
