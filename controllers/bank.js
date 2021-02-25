const cron = require("node-cron");
const querystring = require("querystring");
const { json } = require("body-parser");
const cheerio = require("cheerio");
const config = require("../config");
const { DateTime } = require("luxon");
const request = require("request");
const axios = require("axios");
const fs = require("fs");
const url = require("url");
const path = require("path");
const _ = require("lodash");
// let rp = require("request-promise").defaults({
//   jar: true
// });

// const cookieJar = rp.jar();
// rp = rp.defaults({jar : cookieJar});

// var options = {
//   method: "POST",
//   uri: "https://thestoryks.com/wp-login.php",
//   form: {
//     log: config.WP_USERNAME,
//     pwd: config.WP_PASSWORD,
//     "wp-submit": "Log In",
//     redirect_to: "https://thestoryks.com/wp-admin/",
//   },
//   headers: {},
//   simple: false,
// };
module.exports = {
  getAccess: async (req, res, next) => {
    const result = await axios.post("https://www.blognone.com/");
    const $ = cheerio.load(result.data);
    // console.log($);
    var options = {
      method: "POST",
      uri: "https://www.blognone.com/node?destination=node",
      form: {
        name: "kittipan",
        pass: "0800393608",
        op: "Log In",
        form_id: "user_login_block",
        form_build_id: $("#user-login > input[type=hidden]:nth-child(5)").val(),
      },
      headers: {},
      simple: false,
    };
    res.send(200)
    // rp(options)
    //   .then(function (response) {
    //     rp("https://www.blognone.com/", function (err, res, body) {
    //       console.log(res.headers["set-cookie"]);
    //       const getIndex = cheerio.load(body);
    //       rp("https://www.blognone.com/user/kittipan").then(function (
    //         response
    //       ) {
    //         // console.log(response)
    //       });
    //     });
    //   })
    //   .catch(function (e) {
    //     // console.log(e);
    //   });

    //   const index = await rp.get("https://thestoryks.com/")
    //   console.log(cookieJar.getCookieString("https://thestoryks.com/"))
    // await rp({
    //   uri: "https://thestoryks.com/wp-login",
    //   transform: body => {
    //     return cheerio.load(body)
    //   },
    // })
    //   .then($ => {
    //     document.getElementById('user_login').value = config.WP_USERNAME;
    //     document.getElementById('user_pass').value = config.WP_USERNAME;
    //     document.getElementById("wp-submit").click();
    //     console.log($('#post-604 > header > h2 > a').attr('href'))
    //   })
    //   .catch(e => {
    //     console.error(e)
    //   })
  },
  getImgKiriacoulis: async (req, res, next) => {
    // http://www.kiriacoulis.com/charter/search/
    var listLink = [];
    try {
      const resp = await axios.get(
        "http://www.kiriacoulis.com/charter/search/"
      );
      const body = cheerio.load(resp.data);
      body(".search_yacht_item").each(function () {
        const model = body(this).children().children().children(".yacht_grid_title").text();
        const str = model;
        const res = str.replace("/", "-");
        const dir = replaceKrub(res);
        // const dir = res;
        // if (!fs.existsSync(dir)) {
        //   fs.mkdirSync(dir, {
        //     recursive: true
        //   }, (err) => {});
        // }
        const obj = {
          url: body(this).children().attr("href"),
          folderName: dir.toLowerCase(),
        };
        listLink.push(obj);
      });
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }

    try {
      const pathFilename = "E:/www/sdndev230/website/Boat/pict/upload/"
      fs.readFile(
        "E:/www/sdndev230/website/Boat/pict/upload/somefile.txt", "utf8",
        async function (err, data) {
           console.log(listLink)
          // Display the file content
          const str = data;
          const arrayValue = str.split(",");
          for (const key_url in arrayValue) {
            const arrayBoat = arrayValue[key_url];
            const idBoat = arrayBoat.split("-")[0].trim();
            const modelBoat = arrayBoat.split("-")[1];
            const objModel = _.filter(listLink, ['folderName', modelBoat.toLowerCase()]);
            console.log(idBoat + ' ' +modelBoat)
            console.log(objModel)
            if (!fs.existsSync(pathFilename+idBoat)) {
              fs.mkdirSync(pathFilename+idBoat, {
                recursive: true
              }, (err) => {});
            }
            for  (const key_url in objModel) {
              const respImg = await axios.get(objModel[key_url].url);
              const body = cheerio.load(respImg.data);
              body(".ptb_extra_image").each(async function () {
                // console.log(body(this).attr("src"))
                const linkImage = body(this).attr("src");
                // console.log(random_name)
                const parsed = url.parse(body(this).attr("src"));
                const imageName = path.basename(parsed.pathname);
                if (!fs.existsSync(pathFilename+idBoat+"/" + imageName)) {
                  //file exists
                  const response = await download(
                    linkImage,
                    pathFilename+idBoat+"/" + imageName
                  );
                }
              });
            }
          }
        }
      );
      // for (const key_url in listLink) {
      //   const respImg = await axios.get(listLink[key_url].url);
      //   const body = cheerio.load(respImg.data);
      //   body(".ptb_extra_image").each(async function () {
      //     // console.log(body(this).attr("src"))
      //     const linkImage = body(this).attr("src");
      //     // console.log(random_name)
      //     const parsed = url.parse(body(this).attr("src"));
      //     const imageName = path.basename(parsed.pathname);
      //     if (!fs.existsSync(listLink[key_url].folderName + imageName)) {
      //       //file exists
      //       const response = await download(
      //         linkImage,
      //         listLink[key_url].folderName + "/" + imageName
      //       );
      //     }
      //     console.log(imageName);
      //   });
      // }
    } catch (err) {
      console.error(err);
    }
    res.send(200);
  },
  getRemoveFolder: async (req, res, next) => {
    fs.readdir("./upload", (err, files) => {
      files.forEach((file) => {
        fs.rmdirSync("./upload/" + file);
      });
    });
    res.send(200);
  },
  copyFileTest: async (req, res, next) => {
    fs.readFile(
      "E:\\www\\sdndev230\\website\\Boat\\pict\\upload\\somefile.txt",
      "utf8",
      function (err, data) {
        // Display the file content
        console.log(data);
      }
    );
    res.send(200);
  },
  getImgKiriacoulisPlan: async (req, res, next) => {
    // http://www.kiriacoulis.com/charter/search/
    var listLink = [];
    try {
      const resp = await axios.get(
        "http://www.kiriacoulis.com/charter/search/"
      );
      const body = cheerio.load(resp.data);
      body(".search_yacht_item").each(function () {
        const model = body(this).children().children().children(".yacht_grid_title").text();
        const str = model;
        const res = str.replace("/", "-");
        const dir = replaceKrub(res);
        // if (!fs.existsSync(dir)) {
        //   fs.mkdirSync(dir, {
        //     recursive: true
        //   }, (err) => {});
        // }
        const obj = {
          url: body(this).children().attr("href"),
          folderName: dir.toLowerCase(),
        };
        listLink.push(obj);
      });
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }

    try {
      const pathFilename = "E:/www/sdndev230/website/Boat/pict/upload/plan/"
      fs.readFile(
        "E:/www/sdndev230/website/Boat/pict/upload/somefile.txt", "utf8",
        async function (err, data) {
           console.log(listLink)
          // Display the file content
          const str = data;
          const arrayValue = str.split(",");
          for (const key_url in arrayValue) {
            const arrayBoat = arrayValue[key_url];
            const idBoat = arrayBoat.split("-")[0].trim();
            const modelBoat = arrayBoat.split("-")[1];
            const objModel = _.filter(listLink, ['folderName', modelBoat.toLowerCase()]);
            console.log(idBoat + ' ' +modelBoat)
            console.log(objModel)
            if (!fs.existsSync(pathFilename+idBoat)) {
              fs.mkdirSync(pathFilename+idBoat, {
                recursive: true
              }, (err) => {});
            }
            for  (const key_url in objModel) {
              const respImg = await axios.get(objModel[key_url].url);
              const body = cheerio.load(respImg.data);
              body(".ptb_image").each(async function () {
                // console.log(body(this).attr("src"))
                const linkImage = body(this).attr("src");
                // console.log(random_name)
                const parsed = url.parse(body(this).attr("src"));
                const imageName = path.basename(parsed.pathname);
                if (!fs.existsSync(pathFilename+idBoat+"/" + imageName)) {
                  //file exists
                  const response = await download(
                    linkImage,
                    pathFilename+idBoat+"/" + imageName
                  );
                }
              });
            }
          }
        }
      );
      // for (const key_url in listLink) {
      //   const respImg = await axios.get(listLink[key_url].url);
      //   const body = cheerio.load(respImg.data);
      //   body(".ptb_extra_image").each(async function () {
      //     // console.log(body(this).attr("src"))
      //     const linkImage = body(this).attr("src");
      //     // console.log(random_name)
      //     const parsed = url.parse(body(this).attr("src"));
      //     const imageName = path.basename(parsed.pathname);
      //     if (!fs.existsSync(listLink[key_url].folderName + imageName)) {
      //       //file exists
      //       const response = await download(
      //         linkImage,
      //         listLink[key_url].folderName + "/" + imageName
      //       );
      //     }
      //     console.log(imageName);
      //   });
      // }
    } catch (err) {
      console.error(err);
    }
    res.send(200);
  },
};

async function download(url, dest) {
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);
  console.log(url)
  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true,
      })
      .pipe(file)
      .on("finish", async () => {
        console.log(`The file is finished downloading.`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });
}

function replaceKrub(tmp) {
  tmp = tmp.replace(" (CAT)", "");
  tmp = tmp.replace(" (CAT.)", "");
  tmp = tmp.replace("(CAT)", "");
  tmp = tmp.replace("-2CBS", "");
  tmp = tmp.replace("-4CBS", "");
  tmp = tmp.replace(" - 4 WC", "");
  tmp = tmp.replace(" -3 CBS", "");
  tmp = tmp.replace("-3 CBS", "");
  tmp = tmp.replace("-4 CBS", "");
  tmp = tmp.replace("- 2 HEADS(CAT)", "");
  tmp = tmp.replace("-2 CBS", "");
  tmp = tmp.replace(" (M-Y)", "");
  tmp = tmp.replace(" - 1 WC", "");
  tmp = tmp.replace("-2 WC", "");
  tmp = tmp.replace(" - 2 WC", "");
  tmp = tmp.replace(" (1 WC)", "");
  return tmp;
};
