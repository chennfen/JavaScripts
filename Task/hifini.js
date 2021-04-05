/**
 *  @Author  : s0urce <apao@douyu.tv>
 *  @Date    : 2021/1/14
 *  @Declare : hifini
 *
 */
import axios from 'axios'
const HIFINI_COOKIE = process.env.HIFINI_COOKIE;

const name = 'hifini音乐磁场'
const REG = {
    SIGN_SUCCESS: /成功签到！/,
    SIGNED: /今天已经签过啦！/,
}
const signURL = 'https://www.hifini.com/sg_sign.htm'
const postData = ''
const config = {
    headers: {
        Referer: "https://www.hifini.com",
        Host: "www.hifini.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        cookie: HIFINI_COOKIE,
    },
};

export default () => {
    // 无cookie跳过
    if (!HIFINI_COOKIE) {
        return Promise.reject({ name, state: 'BYPASS' })
    }

    return new Promise((resolve, reject) => {
        axios.post(signURL, postData, config)
            .then(({ data }) => {
                if (REG.SIGN_SUCCESS.test(String(data))) {
                    resolve({ name, state: 'SUCCESS' })
                } else if (REG.SIGNED.test(String(data))) {
                    resolve({ name, state: 'SIGNED' })
                } else {
                    reject({ name, state: 'FAILED' })
                }
            })
            .catch(err => {
                reject({ name, state: 'FAILED' })
            })
    });
}



