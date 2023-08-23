const express = require('express');


const profitsRouter = require('./profits.router');


function routerApi(app) {
  const router = express.Router();
  
  app.use(process.env.ROUTER_INDEX, router);
  router.use('/profits', profitsRouter);

}

module.exports = routerApi;