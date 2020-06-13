const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
}); */
var d = new Date();
var n = d.getTime();
app.use(express.static("public"));
app.get("/api", async(request, response) => {
    let url = request.query.url
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    newUrl = 'http://' + url
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 720
        });
        let fullpag = request.query.fullpage
        let full = false
        if (fullpag == 'true') {
            full = true
        }
        await page.waitFor(5000);
        let fullFileName = url + '-' + n + '.png'
        await page.goto(newUrl); // Read url query parameter.
        const image = await page.screenshot({ fullPage: full });
        await browser.close();
        response.set('Content-Type', 'image/png');
        response.send(image);
    } catch (error) {
        response.send(error);
    }
});

var listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});