let jwt = require('jsonwebtoken')
let createTokens=(userId,sessionId,role)=>{
    console.log("creating tokens: ",sessionId)
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
            expiresIn:"7d"
        }
    )

    return {accessToken,refreshToken}
}

let fetchTokenDetails=(accessToken)=>{
    const {userId,sessionId,role} = jwt.verify(accessToken,process.env.JWT_SECRET)
    return {userId,sessionId,role}
}

let verifyUser=(accessToken)=>{
    let isUser=jwt.verify(accessToken,process.env.JWT_SECRET)
    return isUser
}

let deleteTokens=(res)=>{
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    return true
}
module.exports={createTokens,fetchTokenDetails,verifyUser,deleteTokens}