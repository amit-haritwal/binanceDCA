import { Request, Response } from "express";
import { errorHandler, successHandler } from "./response";
import axios from "axios";
const { Spot } = require("@binance/connector");
const Binance = require("binance-api-node").default;
require("dotenv").config();
export const connectToBinance = async (req: Request, res: Response) => {
  try {
    const client = await Binance({
      apiKey: process.env.binance_Key,
      apiSecret: process.env.binance_Secret,
      httpBase: "https://testnet.binance.vision",
    });

    console.log(
      "connected to binance",
      process.env.binance_Key,
      process.env.binance_Secret
    );
    console.log(
      await client.order({
        symbol: "BNBUSDT",
        side: "SELL",
        quantity: "1",
        price: "0.0002",
      })
    );
    console.log(await client.time());
    var acccountinfo = await client.accountInfo();

    // console.log(
    //   await client.order({
    //     symbol: "BNBUSDT",
    //     side: "BUY",
    //     quantity: "1",
    //     price: "0.0002",
    //   })
    // );
    // const investmentAmount = 1000;
    // const interval = 6; // number of months
    // const investmentPerPurchase = investmentAmount / interval;
    // for (let i = 0; i < interval; i++) {
    //   // Get the latest price of the asset
    //   client.ticker({ symbol: "BTCUSDT" }).then((lastPrice: any) => {
    //     const purchaseQuantity = investmentPerPurchase / parseFloat(lastPrice);
    //     client.order({
    //       symbol: "BTCUSDT",
    //       side: "BUY",
    //       type: "MARKET",
    //       quantity: purchaseQuantity,
    //     });

    //     console.log(client);
    //   });
    // }
    return successHandler(res, 200, true, { client }, "Successfull");
  } catch (error) {
    return errorHandler(res, 500, false, { error: error }, "error");
  }
};

export const invest = async (req: Request, res: Response) => {
  try {
    const { symbol, precentage } = req.body;
    const apiKey = process.env.binance_Key;
    const apiSecret = process.env.binance_Secret;
    const client = new Spot(apiKey, apiSecret, {
      baseURL: "https://testnet.binance.vision",
    });
    var acccountinfo: any = "";
    await client
      .account()
      .then((response: any) => {
        acccountinfo = response.data;
      })
      .catch((error: any) => {
        return errorHandler(
          res,
          500,
          false,
          { error: error.response.data, accountInfo: acccountinfo },
          error.response.data.msg
        );
      });

    const usdtBalance = acccountinfo.balances.filter(
      (balance: any) => balance.asset === "USDT"
    );
    var freevalue = usdtBalance.length > 0 ? usdtBalance[0].free : 0;
    var amounttoinvest = (freevalue * precentage) / 100;

    client
      .tickerPrice(symbol)
      .then(async (response: any) => {
        var quantity = amounttoinvest / response.data.price;
        client
          .newOrder(symbol, "BUY", "MARKET", {
            quantity: quantity.toFixed(2),
          })
          .then(async (response: any) => {
            return successHandler(
              res,
              200,
              true,
              { res: response.data },
              "done"
            );
          })
          .catch((error: any) => {
            return errorHandler(
              res,
              500,
              false,
              {
                error: error.response.data,
                accountInfo: acccountinfo,
                price: response.data.price,
                amounttoinvest,
                freevalue,
                quantity: quantity.toFixed(8),
              },
              error.response.data.msg
            );
          });
      })
      .catch((error: any) => {
        console.log(error.response.data.msg);
        return errorHandler(
          res,
          500,
          false,
          { error: error.response.data, accountInfo: acccountinfo },
          error.response.data.msg
        );
      });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, false, { error: error }, "error");
  }
};
export const getAccountInfo = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.binance_Key;
    const apiSecret = process.env.binance_Secret;
    const client = new Spot(apiKey, apiSecret, {
      baseURL: "https://testnet.binance.vision",
    });
    await client
      .account()
      .then((response: any) => {
        return successHandler(
          res,
          200,
          true,
          { accountinfo: response.data },
          "done"
        );
      })
      .catch((error: any) => {
        return errorHandler(
          res,
          500,
          false,
          { error: error.response.data },
          error.response.data.msg
        );
      });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, false, { error: error }, "error");
  }
};
export const withdraw = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.binance_Key;
    const apiSecret = process.env.binance_Secret;
    const client = new Spot(apiKey, apiSecret, {
      baseURL: "https://testnet.binance.vision",
    });
    await client
      .account()
      .then((response: any) => {
        var accountinfo = response.data;
        const usdtBalance = accountinfo.balances.filter(
          (balance: any) => balance.asset === "BTC"
        );
        var quantity =
          usdtBalance.length > 0 ? parseFloat(usdtBalance[0].free) : 0;
        console.log(quantity);
        client
          .newOrder("BTCUSDT", "SELL", "MARKET", {
            quantity: quantity,
          })
          .then(async (response: any) => {
            return successHandler(
              res,
              200,
              true,
              { res: response.data },
              "done"
            );
          })
          .catch((error: any) => {
            return errorHandler(
              res,
              500,
              false,
              {
                error: error.response.data,
              },
              error.response.data.msg
            );
          });
      })
      .catch((error: any) => {
        console.log(error);
        return errorHandler(
          res,
          500,
          false,
          { error: error.response?.data },
          error.response?.data?.msg
        );
      });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, false, { error: error }, "error");
  }
};
