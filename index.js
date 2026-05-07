require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const http = `http://localhost:${port}`;

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3000/",
  "http://192.168.31.118:3000",
  undefined,
  "undefined",
  "http://localhost:3200/",
  "http://localhost:3200",
  "http://26.1.72.222:3200/",
  "http://26.1.72.222:3200",
  "http://192.168.31.118:3200/",
  "http://192.168.31.118:3200",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("whitelist=:", origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const create_api = require("./api/service");
create_api(app);

app.listen(port, () => {
  console.log(`✨ Example app listening on port ${port} ➡️  ${http}`);
});
