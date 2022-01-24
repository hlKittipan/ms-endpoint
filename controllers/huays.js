const Huay = require("../models/huay");
const { DateTime } = require("luxon");
const request = require("request");
const axios = require("axios");
const fs = require("fs");
const url = require("url");
const path = require("path");
const _ = require("lodash");
const date = DateTime.local().toFormat("dd/LL/yyyy");
module.exports = {

  findData: (req, res, next) => {
    const huay = Huay.findOne({ date: date }).then(function (value) {
      if (!value) throw createData(req, res, next, true , 0);
      createData(req, res, next, false, value._id);
      // console.log(value)
    });
   
  },
  getDataFromHuay: () => {
    axios({
      method: "get",
      url: "https://s1.huay.com/api/lottery/result",
      data: {
        date: DateTime.local().toFormat("dd/LL/yyyy"),
        sid: "a9e35080-fb00-11ea-bc07-4b7305fd5878",
        _: Date.now(),
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVpZCI6MjMzNTY2M30sImlhdCI6MTYwMDg3MTM2MX0.PRJTqfbUmNWrJ25zCGsm1y7o1UwhWkFqeRufk52c2tI",
        "Access-Control-Allow-Origin": "*",
      },
    }).then(function (response) {
      //console.log(response)
      //res.send(response.data)
      Huay.findData(response.data, res, next);
    }).catch(error => {
      console.log(error);
    });
  },getImgKiriacoulis: async (req, res, next) => {
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
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          }, (err) => {});
        }
        const obj = {
          url: body(this).children().attr("href"),
          folderName: dir,
        };
        listLink.push(obj);
      });
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }

    try {
      const pathFilename = "E:/www/sdndev230/website/Boat/pict/"
      fs.readFile(
        "E:/www/sdndev230/website/Boat/pict/upload/somefile.txt", "utf8",
        async function (err, data) {
          // console.log(listLink)
          // Display the file content
          const str = data;
          const arrayValue = str.split(",");
          for (const key_url in arrayValue) {
            const arrayBoat = arrayValue[key_url];
            const idBoat = arrayBoat.split("-")[0].trim();
            const modelBoat = arrayBoat.split("-")[1];
            const objModel = _.filter(listLink, ['folderName', modelBoat]);
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
                console.log(imageName);
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
};

function createData (req, res, next, isCreate, id) {
  const data = req.data.yeekee;
  const yeekee = [];
  const date_thai = req.data.now;

  for (const key in data) {
    if (data[key] !== null ){
      yeekee[key] = data[key].period.result;
    }
  }
  // console.log(isCreate)
  if (isCreate){
    const huay = new Huay({
      date,
      date_thai,
      yeekee,
    });
    const newHuay = huay.save();
    res.send(201);
    next();
  }else {
    
    const filter = { _id: id };
    const update = { date: date ,date_thai : date_thai,yeekee : yeekee };
    //console.log(update)
    const huay = Huay.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }).then(function (value) {console.log(value)});
    res.send(200);
    next();
  }
}


async function download(url, dest) {
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);

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
}