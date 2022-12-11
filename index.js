let exp = require("express")
let bodyParser = require("body-parser")
let https = require("https")
let app = exp()
let port = process.env.PORT || 3000

app.use(exp.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.post("/",(req,res)=>{
    let ipaddress = req.body.ipAddress
    let url = "https://geo.ipify.org/api/v2/country,city?apiKey=at_b0Ho9NYxSZ8B0v8jdxA4sNlL86oE0&ipAddress="+ ipaddress

    https.get(url,(response)=>{
      response.on("data",(d)=>{
        let data=JSON.parse(d)
        let country = data.location.country
        let region = data.location.region
        let timezone = data.location.timezone
        let isp = data.isp
        let lat = data.location.lat
        let lon =  data.location.lng
        let geonameid=data.location.geonameId

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- displays site properly based on user's device -->

        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
        
        <title>Frontend Mentor | IP Address Tracker</title>
        <link rel="stylesheet" href="css/style.css">
        <!-- Feel free to remove these styles or customise in your own stylesheet 👍 -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
        crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
        integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
        crossorigin=""></script>

        </head>
        <body>
        <header>
        <h1>IP Address Tracker</h1>

        <form action="/" method="post">
            <input type="text" name="ipAddress" placeholder="Search for any IP address or domain">
            <button type="submit"><img class="btn-arrow" src="images/icon-arrow.svg" alt=""></button>
        </form>
        

        
        <section>
        <div>
            <b>IP Address</b>
            <h2>`+ipaddress+`</h2>
        </div>
        <hr>
        <div>
            <b>Location</b>
            <h2>`+region+`, <br> `+country+` `+geonameid+`</h2>
        </div>
        <hr>
        <div>
            <b>Timezone</b>
            <h2>UTC`+timezone+`</h2>
            
        </div>
            <hr>
            <div>
            <b>ISP</b>
            <h2 class="largestdata">`+isp+`</h2>
            </div>
        
        </section>


        <!-- add offset value dynamically using the API -->
        </header>

        <main id="map">
            <img class="img" src="images/icon-location.svg" alt="">
        </main>

        <script>
                var map = L.map('map').setView([`+lat+`, `+lon+`], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
        </script>
        </body>
        </html>
        `)

        


      })
    })
})

app.listen(port,()=>{
    console.log("server just started at port 3000")
})