const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt')
const uuid = require('uuid');
const mailService = require('../services/mailService');
const UserDto = require('../dtos/userDto');
const tokenService = require('../services/tokenService')
class UserService {
async registration(email, password) {
    const candidate = await UserModel.findOne({email});
    if(candidate) {
        throw new Error(`The user with the password: ${email} already exists`)
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({email, password: hashedPassword, activationLink});
    await mailService.sendActivationMail(email, activationLink);
    const userDto = new UserDto(user);
    const token = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {...token, user: userDto};
}
}

module.exports = new UserService();
