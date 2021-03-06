const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running");
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    app.post("/failure", function (req, res) {
        res.redirect("/");
    })


    const jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/20807bfc97"
    const options = {
        method: "POST",
        auth: "muktadir:05a766c32d06b5ffff421b664b64e162-us20"
    }
    
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
       response.on("data", function (data) {
           console.log(JSON.parse(data));
       }) 
    });

    request.write(jsonData);
    request.end();


});




// Mailchimp API key
// 05a766c32d06b5ffff421b664b64e162-us20

// Mailchimp List ID
// 20807bfc97

// heroku temp server site https://calm-basin-65282.herokuapp.com/