"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Import Request from 'express'
const dotenv_1 = __importDefault(require("dotenv")); // Import dotenv like this
const dbConnect_1 = require("./config/dbConnect");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, dbConnect_1.dbConnect)();
app.use('/', (req, res) => {
    res.send('Hello there manuel');
});
app.use('/api/user', authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
//# sourceMappingURL=index.js.map