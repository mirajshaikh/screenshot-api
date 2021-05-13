const express = require("express"),
  app = express(),
  puppeteer = require("puppeteer");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
}); */
async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
app.use(express.static("public"));
app.get("/api", async (request, response) => {
  let url = request.query.url;
  var d = Math.random() * 10;
  var n = Math.floor(d);
  let fullFileName = "screenshot" + "-" + n + ".png";
  url = "http://" + url;
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 720,
    });
    let fullpag = request.query.fullpage;
    let full = false;
    if (fullpag == "true") {
      full = true;
    }
    await page.waitFor(5000);
    await page.goto(url); // Read url query parameter.
    await timeout(2000);
    const image = await page.screenshot({
      path: "public/images/screenshot/" + fullFileName,
      fullPage: full,
    });
    await browser.close();
    response.set("Content-Type", "text/json");
    response.json({ imageurl: "/images/screenshot/" + fullFileName });
  } catch (error) {
    response.status(500).send("Something went Wrong!");
  }
});

app.get("/pdf", async (request, response) => {
  let url = request.query.url;
  var d = Math.random() * 10;
  var n = Math.floor(d);
  const url = req.query.target;
  const landscape = req.query.landscape;
  const size = req.query.size;
  const mt = req.query.mt;
  const mb = req.query.mb;
  const ml = req.query.ml;
  const mr = req.query.mr;
  let fullFileName = "pdf" + "-" + n + ".png";
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const webPage = await browser.newPage();

    await webPage.setContent(url, {
      waitUntil: "networkidle0",
    });

    const pdf = await webPage.pdf({
      printBackground: true,
      path: "public/pdfs/" + fullFileName,
      format: size !== undefined ? size : "A4",
      landscape: landscape == "true" ? true : false,
      margin: {
        top: mt !== undefined ? mt : "0px",
        bottom: mb !== undefined ? mb : "0px",
        left: ml !== undefined ? ml : "0px",
        right: mr !== undefined ? mr : "0px",
      },
    });

    await browser.close();

    response.set("Content-Type", "text/json");
    response.json({ imageurl: "/pdfs/" + fullFileName });
  } catch (error) {
    response.status(500).send("Something went Wrong!");
  }
});

var listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
