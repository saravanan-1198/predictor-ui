var exec = require("child_process").exec;
var fs = require("fs");

const string = fs.readFileSync("test.json", "utf-8");

fs.writeFileSync(
  ".env",
  `REACT_APP_FIREBASE_AUTH_JSON=${JSON.stringify(JSON.parse(string))}`
);
