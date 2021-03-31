const cron = require("node-cron");
const cheerio = require("cheerio");
const axios = require("axios");
const _ = require("lodash");
const FormData = require('form-data');

const currentSession = {session:"",sessionToday:""}

module.exports = {
  index: async (req, res, next) => {
    console.log(currentSession)
    if (currentSession.sessionToday === ""){
      if (currentSession.session === "") {
        await getSession()
      } else {
        let isHasSession = await checkSessionAvailable()
        if (isHasSession) {
          getAccoBnk("SESSIONEASY",currentSession.session)
        }else{
          getSession()
        }
      }
    } else {
      let newFormData = new FormData();
      newFormData.append("SESSIONEASY", currentSession.sessionToday);
      getAccoBnkToday(newFormData)
    }
    res.send(200)
  },
}

async function getSession() {
  // const result = await axios.post("https://www.blognone.com/");
  // const $ = cheerio.load(result.data);
  // console.log($);
  try {
    let bodyFormData = new FormData();
    bodyFormData.append('LANG', 'T');
    bodyFormData.append('LOGIN', process.env.SUSE);
    bodyFormData.append('PASSWD', process.env.SPAS);
    bodyFormData.append('lgin.x', 0);
    bodyFormData.append('lgin.y', 0);
    let resp = await axios.post(process.env.SCB_LINK_LOGIN, bodyFormData, { headers: bodyFormData.getHeaders() })
    let $ = cheerio.load(resp.data)
    const nextPage = $("#f1").attr("action")
    const KeySession = $("input").attr("name")
    const ValueSession = $("input[name=SESSIONEASY]").val()
    currentSession.session = ValueSession
    if(nextPage !== undefined){
      getAccoBnk(KeySession,ValueSession)
    }
    
  } catch (err) {
    // Handle Error Here
    console.error(err).status(500);
  }
  
}

async function getAccoBnk(KeySession,ValueSession) {
  let bodyFormData = new FormData();
  bodyFormData.append(KeySession, ValueSession);
  let resp = await axios.post(process.env.SCB_LINK_MYACCO, bodyFormData, { headers: bodyFormData.getHeaders() })
  getTodayAccoBnk(resp)
}

async function getTodayAccoBnk(value) {
  let $ = cheerio.load(value.data)
  const __EVENTTARGET = 'ctl00$DataProcess$SaCaGridView$ctl03$SaCaView_LinkButton'
  // const __EVENTTARGET = $("#__EVENTTARGET").val()
  const __VIEWSTATE = $("#__VIEWSTATE").val()
  const __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val()
  const __SESSION = $("input[name=SESSIONEASY]").val()
  let bodyFormData = new FormData();
  bodyFormData.append("__EVENTTARGET", __EVENTTARGET);
  bodyFormData.append("__EVENTARGUMENT", "");
  bodyFormData.append("__VIEWSTATE", __VIEWSTATE);
  bodyFormData.append("SESSIONEASY", __SESSION);
  bodyFormData.append("__VIEWSTATEGENERATOR", __VIEWSTATEGENERATOR);
  let resp = await axios.post(process.env.SCB_LINK_MYACCO, bodyFormData, { headers: bodyFormData.getHeaders() })
  let body = cheerio.load(resp.data)
  const nextPage = body("#f1").attr("action")
  const KeySession = body("input").attr("name")
  const ValueSession = body("input[name=SESSIONEASY]").val()
  //console.log(resp)
  if(nextPage !== undefined){
    getAccoBnkInfo(nextPage,KeySession,ValueSession)
  }
}

async function getAccoBnkInfo(nextPage,KeySession,ValueSession) {
  let bodyFormData = new FormData();
  bodyFormData.append(KeySession, ValueSession);
  let value = await axios.post(nextPage, bodyFormData, { headers: bodyFormData.getHeaders() })
  let body = cheerio.load(value.data)
  const __SESSION = body("input[name=SESSIONEASY]").val()
  const __VIEWSTATE = body("#__VIEWSTATE").val()
  const __VIEWSTATEGENERATOR = body("#__VIEWSTATEGENERATOR").val()
  const DataProcess_DDLAcctNo = body("#DataProcess_DDLAcctNo").val()
  let bodyForm = new FormData();
  bodyForm.append("__EVENTTARGET", "ctl00$DataProcess$Link2");
  bodyForm.append("__EVENTARGUMENT", "");
  bodyForm.append("__VIEWSTATE", __VIEWSTATE);
  bodyForm.append("__LASTFOCUS", "");
  bodyForm.append("ctl00$DataProcess$DDLAcctNo", DataProcess_DDLAcctNo);
  bodyForm.append("SESSIONEASY", __SESSION);
  bodyForm.append("__VIEWSTATEGENERATOR", __VIEWSTATEGENERATOR);
  let resp = await axios.post(process.env.SCB_LINK_MYACCOINFO, bodyForm, { headers: bodyForm.getHeaders() })
  let $ = cheerio.load(resp.data)
  const Key = $("input").attr("name")
  const Value = $("input[name=SESSIONEASY]").val()
  let newFormData = new FormData();
  newFormData.append(Key, Value);
  currentSession.sessionToday = Value
  getAccoBnkToday(newFormData)
}

async function getAccoBnkToday(value) {  
  let resp = await axios.post(process.env.SCB_LINK_MYACCOTODAY, value, { headers: value.getHeaders() })
  let $ = cheerio.load(resp.data)
  const nextPage = $("#f1").attr("action")  
  console.log($("#DataProcess_GridView").html())
  if(nextPage !== undefined){
    getSession()
  }
}

async function checkSessionAvailable(){
  let bodyFormData = new FormData();
  bodyFormData.append("SESSIONEASY", currentSession.session);
  let resp = await axios.post(process.env.SCB_LINK_MYACCO, bodyFormData, { headers: bodyFormData.getHeaders() })
  let body = cheerio.load(resp.data)
  const nextPage = body("#f1").attr("action")
  if(nextPage === undefined){
    return true
  }else{
    return false
  }
}


