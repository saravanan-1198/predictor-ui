var exec = require("child_process").exec;
var fs = require("fs");
var axios = require("axios");
var key = "s3cr3tEncrypt1onKey";
var decryptor = require("simple-encryptor")(key);
axios.get("https://salesprediction.el.r.appspot.com/api/secret",{
  headers: {
    "secret": "bypassKeyForSecret"
  }
}).then((res)=>{
  var obj = decryptor.decrypt(res.data);
  // console.log(obj);
  fs.writeFileSync(
  ".env",
  `REACT_APP_FIREBASE_AUTH_JSON=${JSON.stringify(obj)}`
);
})
// const string = fs.readFileSync("test.json", "utf-8");
