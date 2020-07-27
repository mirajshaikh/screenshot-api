const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
}); */

app.use(express.static("public"));
app.get("/api", async(request, response) => {
    let url = request.query.url
    var d = new Date();
    var n = d.getTime();
    let fullFileName = url + '-' + n + '.png'
    url = "http://" + url
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720
        });
        let fullpag = request.query.fullpage
        let full = false
        if (fullpag == 'true') {
            full = true
        }
        await page.waitFor(5000);

        await page.goto(url); // Read url query parameter.
        const image = await page.screenshot( {path:"public/images/screenshot/"+fullFileName,fullPage: full});
        await browser.close();
        response.set('Content-Type', 'text/json');
        response.json({imageurl:"/images/screenshot/"+fullFileName});
    } catch (error) {
        response.status(500).send('Something went Wrong!');
    }
});

var listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});