const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');

const {
    getProfitsSchema
} = require('../schemas/profit.schema');

const ProfitService = require('../services/profit.service');

const router = express.Router();
const service = new ProfitService();

router.get('/all',
  async (req, res, next) => {
    try {
      const response = await service.findHistoricProfit();
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/day',
  validatorHandler(getProfitsSchema, 'query'),
  async (req, res, next) => {
    try {
      const { query } = req;
      const response = await service.findDayProfit(query);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
