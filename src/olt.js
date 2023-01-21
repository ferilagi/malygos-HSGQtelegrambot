const axios = require('axios');
const crypto = require('crypto');
const { message } = require('telegraf/filters');

require('dotenv').config()

const olt = process.env.OLT_URL;
const typeOlt = process.env.OLT_TYPE;

const userName = process.env.UNAME;
const userPwd = process.env.UPASS;

let key = crypto.createHash('md5').update(userName + ":" + userPwd).digest("hex");
let passwordValue = Buffer.from(userPwd, 'utf8').toString('base64');

var xToken = "";


const getToken = async () => {
    let resp;
    try {
      resp = await axios({
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
            })
    } catch (e) {
      // catch error
      throw new Error(e.message)
    }
    // console.log('getToken ' + resp.headers["x-token"]);
    return resp.headers["x-token"];
}

const onuTable = async () => {
    let resp;
    if (xToken == "") {
        xToken = await getToken();
    }
    try {
        resp = await axios.get(olt + '/onutable', {
                headers: {
                    "X-Token": xToken
                }
            })
    } catch (e) {
        // catch error
        throw new Error(e.message)
    }

    console.log("onuTable " +resp.data.message);
    if (resp.data.message == 'Token Check Failed') {
        return text = 'Maaf terjadi kesalahan, Silahkan coba lagi';
    } else {
        return resp.data.data;
    }
}

const infoHSGQ = async () => {
    let text;
    let resp;
    if (xToken == "") {
        xToken = await getToken();
    }
    try {
        resp = await axios.get(olt + '/board?info=pon', {
                headers: {
                    "X-Token": xToken
                }
            })
    } catch (e) {
        // catch error
        console.log(e.message);
        throw new Error(e.message)
    }

    console.log(resp.data.message);
    if (resp.data.message == 'Token Check Failed') {
        return text = 'Maaf terjadi kesalahan, Silahkan coba lagi';
    } else {
        info = resp.data.data;
        return text = `Info Jumlah & Status Onu
    Pon ${info[0].port_id} = online : ${info[0].online}, offline : ${info[0].offline}
    Pon ${info[1].port_id} = online : ${info[1].online}, offline : ${info[1].offline}
    Pon ${info[2].port_id} = online : ${info[2].online}, offline : ${info[2].offline}
    Pon ${info[3].port_id} = online : ${info[3].online}, offline : ${info[3].offline}
    `;
    }
}

const onuDetail = async (onuName) => {
    let text;
    let respA;
    let respB;
    let onuTables = await onuTable();
    const finding = onuTables.find((val) => val.macaddr.toLowerCase() == onuName.toLowerCase() || val.onu_name.toLowerCase() == onuName.toLowerCase());
    if (finding) {
        try {
            respA = await axios.get(olt + '/onumgmt?form=optical-diagnose&port_id='+finding.port_id+'&onu_id='+finding.onu_id,{
                headers: {
                    "X-Token": xToken
                }
            })            
        } catch (error) {
            // catch error
            throw new Error(e.message)
        }

        try {
            respB = await axios.get(olt + '/onumgmt?form=base-info&port_id='+finding.port_id+'&onu_id='+finding.onu_id,{
                headers: {
                    "X-Token": xToken
                }
            })
            
        } catch (error) {
             // catch error
             throw new Error(e.message)
        }
        // console.log(`resA ${opticalDiagnostic}`);
        opticalDiagnostic = respA.data.data;        
        // console.log(`resB ${detail}`);
        detail = respB.data.data;
        return text = "Mac Address : " + detail.macaddr + "\nJarak : " + detail.distance + " M \nStatus : " + detail.status + "\nTemperatur : " + opticalDiagnostic.work_temprature + "\nVoltage : " + opticalDiagnostic.work_voltage + "\nTx Bias : " + opticalDiagnostic.transmit_bias + "\nTx Power : " + opticalDiagnostic.transmit_power + "\nRx Power : " + opticalDiagnostic.receive_power + "\n";
        
    } else {
        // console.log("Maaf, " +onuName+ " tidak ditemukan"); 
        return text = "Maaf, " +onuName+ " tidak ditemukan";
    }
}

module.exports = { infoHSGQ, onuDetail };