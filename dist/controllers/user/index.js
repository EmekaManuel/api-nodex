"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../models/userModel"));
const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await userModel_1.default.findOne(email);
    if (!findUser) {
        const newuser = userModel_1.default.create(req.body);
        res.json({ msg: 'new user created', newuser });
    }
    else {
        res.json({ msg: 'user already exists', success: false });
    }
};
exports.default = createUser;
//# sourceMappingURL=index.js.map