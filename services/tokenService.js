const jwt = require('jsonwebtoken');
const TokenModel = require('../models/tokenModel')
class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            tokenData.save();
        }
        const token = await TokenModel.create({user: userId, refreshToken});
        return token;
    }
}

module.exports = new TokenService();
