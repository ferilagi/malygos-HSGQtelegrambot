const axios = require('axios');
const crypto = require('crypto');

require('dotenv').config()

const olt = process.env.OLT_URL;
const typeOlt = process.env.OLT_TYPE;

const userName = process.env.UNAME;
const userPwd = process.env.UPASS;

let key = crypto.createHash('md5').update(userName + ":" + userPwd).digest("hex");
let passwordValue = Buffer.from(userPwd, 'utf8').toString('base64');

function getToken(){
    if (typeOlt == "EPON") {
        axios({
            method: 'post',
            url: olt + "/userlogin?form=login",
            data: {
                method: "set",
                param: {
                    name: userName,
                    key: key,
                    value: passwordValue,
                    captcha_v: "",
                    captcha_f: ""
                }
            }     
    
        }).then((res) => {
            console.log(res.headers["x-token"]);
            return xToken = res.headers["x-token"];
        })
    } else if (typeOlt == "GPON") {
        return xToken = "";
    }
}

module.exports = { getToken };