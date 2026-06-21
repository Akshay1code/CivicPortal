let jwt = require('jsonwebtoken')
let createTokens=(userId,sessionId,role)=>{
    let accessToken=jwt.sign(
        {
            userId:userId,
            sessionId:sessionId,
            role:role
        },process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )

    let refreshToken = jwt.sign(
        {
            userId:userId,
            sessionId:sessionId,
            role:role
        },process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )

    return {accessToken,refreshToken}
}

let fetchTokenDetails=(accessToken)=>{
    const {userId,sessionId,role} = jwt.verify(accessToken,process.env.JWT_SECRET)
    return {userId,sessionId,role}
}
module.exports={createTokens,fetchTokenDetails}