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
exports.scanLeaks = scanLeaks;
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function scanLeaks(modelName) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield playwright_1.chromium.launch({
            headless: true,
            channel: 'chrome', // Use the full Chromium instead of default bundled one
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = yield browser.newPage();
        const query = modelName.toLowerCase().replace(/\s+/g, '-');
        const searchUrl = 'https://fapello.com/';
        const foundLinks = [];
        console.log(`🔍 Searching for '${query}' on Fapello...`);
        yield page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
        yield page.waitForTimeout(1000);
        yield page.fill('input[name="q"]', modelName);
        yield page.click('button[type="submit"].icon-material-outline-search');
        yield page.waitForTimeout(3000);
        const links = yield page.$$eval('a', (anchors) => anchors
            .map((a) => {
            var _a;
            return ({
                href: a instanceof HTMLAnchorElement ? a.href : '',
                text: ((_a = a.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '',
            });
        })
            .filter((a) => a.href.includes('fapello.com') &&
            a.href.length < 100 &&
            !a.href.includes('/search/') // skip search result pages
        ));
        const matched = Array.from(new Set(links
            .filter((link) => link.href.toLowerCase().includes(query) || link.text === modelName.toLowerCase())
            .map((link) => link.href)));
        console.log(`🎯 Matched ${matched.length} links for "${modelName}"`);
        const screenshotDir = path_1.default.join(process.cwd(), 'public', 'screenshots');
        if (!fs_1.default.existsSync(screenshotDir))
            fs_1.default.mkdirSync(screenshotDir, { recursive: true });
        let index = 1;
        for (const url of matched.slice(0, 5)) {
            try {
                console.log(`🔍 Visiting ${url}`);
                yield page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                yield page.waitForTimeout(2000);
                const slug = url.split('/').filter(Boolean).pop() || `profile-${index}`;
                const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, ''); // sanitize filename
                const screenshotFile = `${query}-${cleanSlug}.png`;
                const fullPath = path_1.default.join(screenshotDir, screenshotFile);
                console.log(`📸 Taking screenshot of ${slug}...`);
                yield page.screenshot({ path: fullPath, fullPage: true });
                console.log(`✅ Saved as ${screenshotFile}`);
                foundLinks.push({
                    url: `/screenshots/${screenshotFile}`,
                    site: 'fapello.com',
                    screenshotPath: fullPath,
                    sourceUrl: url,
                });
            }
            catch (err) {
                console.error(`❌ Error visiting ${url}`, err);
            }
        }
        console.log(`✅ Finished capturing ${foundLinks.length} results.`);
        yield browser.close();
        return foundLinks;
    });
}
