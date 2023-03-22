const attachCookie =({res,token})=>{
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token', token, { expires: new Date(Date.now() + oneDay), httpOnly: true,secure: process.env.NODE_ENV === 'production'  })
}

module.exports = attachCookie