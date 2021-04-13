const express = require('express')
const config = require('config')
const cors = require('cors')
const fetch = require('node-fetch')
const http = require('http')

const PORT = config.get('port') || 5000
const app = express()

app.use(cors())

app.get('/weather/one', (req, res) => {

    try {
        http.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(req.query.q)}&units=metric&appid=5081752d6a968c64d7d320d6e1a34532&lang=ru`, function (resp) {
        var body = ''
        resp.on('data', function (data) {
            body += data
        })
        resp.on('end', function () {
            var json = JSON.parse(body)
            console.log(json)
            if (json.cod == 200) {
                res.status(200).json(json)
            } else if (json.cod == 404) {
                res.status(200).json({code_status: 404, message: json.message})
            } else if (json.cod == 401) {
                res.status(200).json({code_status: 401, message: "key problem"})
            } else if (json.cod == 429) {
                res.status(200).json({code_status: 429, message: "limit"})
            } else {
                res.status(200).json({message_default: "error " + json.cod})
            }
        })
    })
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так"})
    }
})

app.listen(PORT, () => {
    console.log('Server has been started...')
})