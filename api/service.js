const user = require("./user/route");
const auth = require("./authentication/Route");
const dashboard = require("./dashboard/Route");
const editfarm = require("./editfarm/Route");
const editproduct = require("./editproduct/Route");

module.exports = (app) => {
  app.use("/api", user);
  app.use("/api", auth);
  app.use("api", dashboard);
  app.use("/api", editfarm);
  app.use("/api", editproduct);
};
