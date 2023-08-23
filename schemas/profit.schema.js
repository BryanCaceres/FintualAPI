const Joi = require('joi');

const fromDate = Joi.date().iso().min('2018-07-01')
const toDate = Joi.date().iso().min('2018-07-01')


const getProfitsSchema = Joi.object({
  toDate: toDate.required(),
  fromDate: fromDate
});


module.exports = { 
  getProfitsSchema,
 }