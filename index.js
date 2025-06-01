const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const fs = require("fs");
const path = require("path");

const genReportFromLocalhost = async (qbenchOrderId) => {
  let browser = null;
  // chromium.setHeadlessMode = true;
  chromium.setGraphicsMode = false;
  try {
    // testing start
    let executablePath = path.join(
      __dirname,
      `\\chromium\\win64-1270679\\chrome-win\\chrome.exe`
    );
    // executablePath = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    console.log("executablePath: ", executablePath);
    // console.log("chromium.args: ", chromium.args);
    console.log("\n");
    const puppeteerOptions = {
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [
        "--allow-pre-commit-input",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-sync",
        "--enable-automation",
        "--enable-blink-features=IdleDetection",
        "--export-tagged-pdf",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        "--no-first-run",
        "--password-store=basic",
        "--use-mock-keychain",
        "--disable-domain-reliability",
        "--disable-print-preview",
        "--disable-speech-api",
        "--disk-cache-size=33554432",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-pings",
        // "--single-process",
        
        "--font-render-hinting=none",
        "--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints,AudioServiceOutOfProcess,IsolateOrigins,site-per-process",
        "--enable-features=NetworkServiceInProcess2,SharedArrayBuffer",
        "--hide-scrollbars",
        "--ignore-gpu-blocklist",
        "--in-process-gpu",
        "--window-size=1920,1080",
        "--disable-webgl",
        "--allow-running-insecure-content",
        "--disable-setuid-sandbox",
        "--disable-site-isolation-trials",
        "--disable-web-security",
        "--no-sandbox",
        "--no-zygote",
        "--headless='chrome-headless-shell'",
        // ...chromium.args,
        //   '--disable-features=site-per-process'
      ], //[...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    };

    // let fontPath = path.join(__dirname, "\\", "src\\templates\\fonts");
    // await chromium.font(`${fontPath}\\GillSans.ttf`);
    // await chromium.font(`${fontPath}\\GillSansBold.ttf`);
    // await chromium.font(`${fontPath}\\GillSansMedium.ttf`);

    browser = await puppeteer.launch(puppeteerOptions); //

    let page = await browser.newPage();

    const pageUrl = `http://localhost:3003/view-report-for-pdf?qbenchOrderId=${qbenchOrderId}`;
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    // await page.waitForNavigation();
    // Wait for the page to finish rendering

    const pdfOptions = {
      format: "LETTER",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      landscape: false,
      timeout: 0, //30 * 60 * 1000,
    };
    let pdfBuffer = await page.pdf(pdfOptions);

    // testing end
    console.log("pdfBuffer: ", pdfBuffer);
    fs.writeFile("from_api.pdf", pdfBuffer, (err) => {
      if (err) throw err;
      console.log("PDF file has been saved.");
    });
  } catch (error) {
    console.log("error on chromium.puppeteer.launch->>error: ", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

genReportFromLocalhost(197); // 30
