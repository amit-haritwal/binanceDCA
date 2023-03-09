import express from "express";
import {
  connectToBinance,
  invest,
  withdraw,
  getAccountInfo,
} from "./connection";

const investRouter = express();

// get
investRouter.post("/invest", invest);
investRouter.get("/withdraw", withdraw);
investRouter.get("/getAccountInfo", getAccountInfo);

export default investRouter;
