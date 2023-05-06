const {verify} = require('jsonwebtoken')
const {Token} = require('../models/Schemas')

const invalidCsrfToken = async(err, req, res, next) => {
  if(err.code !== 'EBADCSRFTOKEN') return next(err);

  res.status(403)
  res.sent('session has expired ot form tampered with')
}

module.exports = {invalidCsrfToken};