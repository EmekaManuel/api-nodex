"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.Mongo_Uri;
const dbConnect = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MongoDB connection string is undefined');
        }
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Database error:', error.message);
    }
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=dbConnect.js.map