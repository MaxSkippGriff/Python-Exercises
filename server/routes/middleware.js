const jwt = require('jwt-simple')
const moment = require('moment')

exports.check_api_token = (req, res, next) => {
    const token = req.get('x-access-token')

    if (!token) {
      return res.status(401).json({
        error: 'Authentication failure: X-Access-Token information could not be found in the request'
      })
    }
  
    // check the token
    try {
      const decodedToken = jwt.decode(token, 'secret')
  
      // check if it is expired
      if (decodedToken.exp < moment().valueOf()) {
        return res.status(401).json({
          error: 'Authentication failed: Token has expired'
        })
      }
      req.body.userId = decodedToken.iss
      next()
    } catch (err) {
      res.status(401).json({
        error: 'Authentication failed: Invalid Token'
      })
    }
  }