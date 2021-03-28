/*　　　　　　　　　　
说明详情请见：https://raw.githubusercontent.com/CenBoMin/GithubSync/main/RUNSTEP/readme.js
*/
const jsname = '👟走路赚钱-提现专用'
const $ = Env(jsname)
//0为关闭日志，1为开启,默认为0
const logs = 0;
//0为关闭通知，1为所有通知,默认为0
const notify = $.isNode() ? require("./sendNotify") : ``;
const notifyInterval = 1;
//通知风格
let tz = '';
let version = $.getval('version') || "1.5.1"; //APP版本号,更新请到APP更改
//////////////////////////////////////////////////////////////////
//hour&min
var usercash,userjkb,userstep

var hour = '';
var minute = '';
if ($.isNode()) {
  hour = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).getHours();
  minute = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).getMinutes();
} else {
  hour = (new Date()).getHours();
  minute = (new Date()).getMinutes();
}
//现在毫秒格式(13位数)
let todaytimems = Math.round(Date.now())
//现在秒格式(10位数)
let todaytimes = Math.round(Date.now() / 1000)
//今天20200101格式
let today1 = formatDateTime(new Date());
//今天2021.01.30 17:32:01格式
let today2 = formatDateTime(todaytimes);

//////////////////////////////////////////////////////////////////
const runsteptokenArr = [];
let runsteptokenVal = "";

const runstepkeyArr = [];
let runstepkeyVal = "";

const txtokenArr = [];
let txtokenVal = "";

const txkeyArr = [];
let txkeyVal = "";

if ($.isNode()) {

  if (process.env.RUNSTEP_TOKEN && process.env.RUNSTEP_TOKEN.split('\n').length > 0) {
     runsteptokenVal = process.env.RUNSTEP_TOKEN.split('\n');
    } else  {
     runsteptokenVal = process.env.RUNSTEP_TOKEN.split()
    };

  if (process.env.RUNSTEP_KEY && process.env.RUNSTEP_KEY.split('\n').length > 0) {
     runstepkeyVal = process.env.RUNSTEP_KEY.split('\n');
    } else  {
     runstepkeyVal = process.env.RUNSTEP_KEY.split()
    };

  if (process.env.RUNSTEPTX_TOKEN && process.env.RUNSTEPTX_TOKEN.split('\n').length > 0) {
     txtokenVal = process.env.RUNSTEPTX_TOKEN.split('\n');
    } else  {
     txtokenVal = process.env.RUNSTEPTX_TOKEN.split()
    };

  if (process.env.RUNSTEPTX_KEY && process.env.RUNSTEPTX_KEY.split('\n').length > 0) {
     txkeyVal = process.env.RUNSTEPTX_KEY.split('\n');
    } else  {
     txkeyVal = process.env.RUNSTEPTX_KEY.split()
    };
    Object.keys(runsteptokenVal).forEach((item) => {
      if (runsteptokenVal[item]) {
        runsteptokenArr.push(runsteptokenVal[item])
      }
    });

    Object.keys(runstepkeyVal).forEach((item) => {
      if (runstepkeyVal[item]) {
        runstepkeyArr.push(runstepkeyVal[item])
      }
    });


  Object.keys(txtokenVal).forEach((item) => {
    if (txtokenVal[item]) {
      txtokenArr.push(txtokenVal[item])
    }
  });


  Object.keys(txkeyVal).forEach((item) => {
    if (txkeyVal[item]) {
      txkeyArr.push(txkeyVal[item])
    }
  });

} else {
  runsteptokenArr.push($.getdata('runsteptoken'));
  runstepkeyArr.push($.getdata('runstepkey'));
  txtokenArr.push($.getdata('txtoken'));
  txkeyArr.push($.getdata('txkey'));
  // 根据boxjs中设置的额外账号数，添加存在的账号数据进行任务处理
  let Count = ($.getval('Count') || '1') - 0;
  for (let i = 2; i <= Count; i++) {
    if ($.getdata(`runsteptoken${i}`)) {
      runsteptokenArr.push($.getdata(`runsteptoken${i}`));
      runstepkeyArr.push($.getdata(`runstepkey${i}`));
      txtokenArr.push($.getdata(`txtoken${i}`));
      txkeyArr.push($.getdata(`txkey${i}`));
    }
  }
}

//////////////////////////////////////////////////////////////////

!(async () => {
  cc = (`${jsname}任务执行通知🔔`);
  if (!runsteptokenArr[0]) {
    console.log($.name, '【提示】请先前往获取cookie📲')
    return;
  }
  $.msg('现在时间为'+hour+':'+minute)
  console.log(`\n✅ 检查共有多少个账号。。。`)
  await $.wait(4000)
  console.log(`👥 本次执行共${txtokenArr.length}个账号`)
  for(let i = 0; i < txtokenArr.length; i++){
    runsteptokenVal = runsteptokenArr[i];
    runstepkeyVal = runstepkeyArr[i];
    txtokenVal = txtokenArr[i];
    txkeyVal = txkeyArr[i];

    console.log(`\n💗💕 开始${$.name}账号【${(i+1)}】 💕💗\n`)
    await $.wait(3000)
    await runstepcash();
    await showmsg2();
  }


})()
.catch((e) => $.logErr(e))
  .finally(() => $.done())
//////////////////////////////////////////////////////////////////
//通知1
function showmsg1() {
  if (notifyInterval != 1) {
    console.log(cc + '\n' + tz);
  }

  if (notifyInterval == 1) {
    $.msg(cc, '\n', tz);
  }
}
//通知2
async function showmsg2() {
  if (notifyInterval == 1) {
    if ($.isNode()) {
      if (hour == 8 || hour == 0 || hour == 12 || hour == 23) {
        await notify.sendNotify($.name, tz)
      }
    } else {
      if (hour == 8 || hour == 0 || hour == 12 || hour == 23) {
        $.msg(cc, '', tz);
      }
    }
  } else if (notifyInterval == 0) {
    console.log(cc + '' + tz);
  }
}
//////////////////////////////////////////////////////////////////
async function runstepcash() {
  await myself()
  await txlog()
  console.log(`\n🇨🇳【开始提现任务】`)
  $.log('👩‍⚕️提现策略:\n账户金额大于50元,优先提现50元,否则提现1元。\n')
  if (hour == 0 || hour == 12 || hour == 17) {
    await cash()
  } else {
    $.log(`👧每天提现为：凌晨零点,中午12点,下午5点...请自行设置定时，或者手动执行！\n`)
    $.log(`📵温馨提示(1):每天提现只能执行一次,两次以上会有黑号风险！\n`)
    tz += `👧每天提现为：凌晨零点,中午12点,下午5点...请自行设置定时，或者手动执行！\n`
    tz += `📵温馨提示:每天提现只能执行一次,两次以上会有黑号风险！\n`
  }
}
///////////////////////////【提现】//////////////////////////////////
//myself
async function myself() {
  return new Promise((resolve) => {
    let url = {
      url: `https://runstep.kujievip.com/runstep/myself?appid=${txtokenVal}=${version}&${runsteptokenVal}&path=p%2Faccount%2Ftake%2Ftake&platform=miniProgram&env=production`,
      body: ``,
      headers: JSON.parse(txkeyVal),
    };
    $.get(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            if (logs == 1) $.log(data)
            data = JSON.parse(data);
            userjkb = data.data.user_detail.jkb
            userstep = data.data.user_detail.step
            usercash = data.data.user.money
            $.log(`\n👤用户信息`);
            $.log(`【用户名】:${data.data.user.nickname}`);
            $.log(`【余额】:¥${data.data.user.money}`);
            $.log(`【提现次数】:共${data.data.user_detail.tx_num}次`);
            tz += `👤用户信息\n`
            tz += `【用户名】:${data.data.user.nickname}\n`
            tz += `【余额】:¥${data.data.user.money}\n`
            tz += `【提现次数】:共${data.data.user_detail.tx_num}次\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
//txlog
async function txlog() {
  return new Promise((resolve) => {
    let url = {
      url: `https://runstep.kujievip.com/runstep/txlog?page=1&appid=${txtokenVal}=${version}&${runsteptokenVal}&path=p%2Faccount%2Flog%2Flog&platform=miniProgram&env=production`,
      body: ``,
      headers: JSON.parse(txkeyVal),
    };
    $.get(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            if (logs == 1) $.log(data)
            data = JSON.parse(data);
            for (txloglist of data.data.list) {
              txlogbefore = txloglist.before
              txlogafter = txloglist.after
              txlogstatus = txloglist.status_text
              txlogtime = txloglist.createtime_text
              txlogmoney = txloglist.money * -1
              $.log(`\n🙇查询${txlogtime}提现到账状态`);
              $.log(`【提现金额】:¥${txlogmoney}`);
              $.log(`【提现状态】:¥${txlogbefore}→¥${txlogafter}`);
              $.log(`【余额变化】:${txlogstatus}\n`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
//cash
async function cash() {
  if (usercash >= 50) {
    $.log(`开始请求提现5元...\n`);
    await cash50()
  } else if(usercash <= 1) {
    $.log(`【请求提现1元】:账户金额不足1元！\n`);
    tz += `【请求提现1元】:账户金额不足1元！\n`
  }else{
    //$.log(`【请求提现1元】:⛔️目前失效,暂停请求提现1元\n`);
    $.log(`开始请求提现1元...\n`);
    await cash1()
  }
}
async function cash1() {
  return new Promise((resolve) => {
    let url = {
      url: `https://runstep.kujievip.com/runstep/applytx?account=1&type=2&appid=${txtokenVal}=${version}&${runsteptokenVal}&path=p%2Faccount%2Ftake%2Ftake&platform=miniProgram&env=production`,
      body: ``,
      headers: JSON.parse(txkeyVal),
    };
    $.get(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            if (logs == 1) $.log(data)
            data = JSON.parse(data);
            $.log(`【提现请求1元】:成功🎉\n`);
            tz += `【提现请求1元】:成功🎉\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function cash50() {
  return new Promise((resolve) => {
    let url = {
      url: `https://runstep.kujievip.com/runstep/applytx?account=50&type=2&appid=${txtokenVal}=${version}&${runsteptokenVal}&path=p%2Faccount%2Ftake%2Ftake&platform=miniProgram&env=production`,
      body: ``,
      headers: JSON.parse(txkeyVal),
    };
    $.get(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            if (logs == 1) $.log(data)
            data = JSON.parse(data);
            $.log(`【提现请求50元】:成功🎉\n`);
            tz += `【提现请求50元】:成功🎉\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

/////////////////////////////////////////////////////////////

//解码URIcode
function URIcodetranslate(code) {
  return decodeURIComponent(code);
}
//毫秒时间戳改日期 2021.01.08 05:30:13
function time(time) {
  var date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}
//安全获取
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`⛔️服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
//毫秒时间戳转时间 20200108
function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + m + d;
};

function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }
    get(t) {
      return this.send.call(this.env, t)
    }
    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports
    }
    isQuanX() {
      return "undefined" != typeof $task
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }
    isLoon() {
      return "undefined" != typeof $loon
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {}
      return s
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i))
      })
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), a = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {
            script_text: t,
            mock_type: "cron",
            timeout: r
          },
          headers: {
            "X-Key": o,
            Accept: "*/*"
          }
        };
        this.post(a, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }
    loaddata() {
      if (!this.isNode()) return {}; {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {}; {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i)
        if (r = Object(r)[t], void 0 === r) return s;
      return r
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }
    get(t, e = (() => {})) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body)
      }))
    }
    post(t, e = (() => {})) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      });
      else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t));
      else if (this.isNode()) {
        this.initGotEnv(t);
        const {
          url: s,
          ...i
        } = t;
        this.got.post(s, i).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => {
          const {
            message: s,
            response: i
          } = t;
          e(s, i, i && i.body)
        })
      }
    }
    time(t) {
      let e = {
        "M+": (new Date).getMonth() + 1,
        "d+": (new Date).getDate(),
        "H+": (new Date).getHours(),
        "m+": (new Date).getMinutes(),
        "s+": (new Date).getSeconds(),
        "q+": Math.floor(((new Date).getMonth() + 3) / 3),
        S: (new Date).getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
      return t
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
          "open-url": t
        } : this.isSurge() ? {
          url: t
        } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            }
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            }
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            }
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }
    done(t = {}) {
      const e = (new Date).getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}



