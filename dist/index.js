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
const path_1 = __importDefault(require("path"));
const scraper_1 = require("./scraper");
const app = (0, express_1.default)();
// add this before any route:
app.use('/screenshots', express_1.default.static(path_1.default.join(__dirname, '../public/screenshots')));
app.use((0, cors_1.default)({
    origin: 'https://dmca-dashboard.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));
app.use(express_1.default.json());
app.post('/scan-leaks', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("🔥 Received scan request", req.body);
        const { modelName } = req.body;
        if (!modelName)
            return res.status(400).json({ error: 'Missing model name' });
        try {
            const results = yield (0, scraper_1.scanLeaks)(modelName);
            res.json({ success: true, foundLinks: results });
        }
        catch (err) {
            console.error("❌ Scan failed:", err);
            res.status(500).json({
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    }))();
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Scraper running on http://localhost:${PORT}`));
