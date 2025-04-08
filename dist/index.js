"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
/** @type {{ scanLeaks: (modelName: string) => Promise<any[]> }} */
const { scanLeaks } = require('../dist/scraper');
const app = (0, express_1.default)();
// Allow cross-origin requests from frontend
app.use((0, cors_1.default)({
    origin: 'https://dmca-dashboard.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));
// Handle preflight
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
app.post('/scan-leaks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔥 Received scan request", req.body);
    const { modelName } = req.body;
    if (!modelName)
        return res.status(400).json({ error: 'Missing model name' });
    try {
        const results = yield scanLeaks(modelName);
        res.json({ success: true, foundLinks: results });
    }
    catch (err) {
        console.error("❌ Scan failed:", err);
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}));
app.listen(4000, () => console.log('✅ Scraper running on http://localhost:4000'));
