const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const groupRouter = require("./group.routes");
module.exports = (app) => {
    app.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
      );
      next();
    });

    
    app.use("/", authRouter);
    app.use("/user", userRouter);
    app.use("/group", groupRouter);
  };
  