const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
app.get("/api", async(request, response) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 1080
        });
        let fulls = request.query.full
        if (fulls == 1) {
            prams = { fullPage: true }
        } else {
            prams = { fullPage: false }
        }
        console.log(request.query.url)

        await page.goto(request.query.url); // Read url query parameter.
        const image = await page.screenshot({ prams, path: 'screenshot.png' });
        await browser.close();
        response.download('./example.png');
    } catch (error) {
        console.log(error);
    }
});

var listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});