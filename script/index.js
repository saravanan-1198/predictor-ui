var exec = require("child_process").exec;
var fs = require("fs");

exec(
  'gcloud secrets versions access latest --secret="Firebase_Auth_JSON"',
  (err, out) => {
    fs.writeFileSync(
      ".env",
      `REACT_APP_FIREBASE_AUTH_JSON=${JSON.stringify(JSON.parse(out))}`
    );
  }
);
