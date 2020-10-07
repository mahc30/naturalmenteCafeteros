const express = require('express');
var mysql = require('mysql')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

//DB config
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'monitoreocultivos'
})
db.connect((err) => { err ? console.log(err) : console.log("Connected to db") })

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.get('/tablas', (req, res) => {
    let sql = "select * from readings";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        let html = `
        <h1> Registros del Monitoreo del Cultivo </h1>
        <div style="display: flex; " >
        <div style="flex: 50%; text-align:center;">
        <hr>
        <h1> Lecturas de Sensores </h1>
        <hr>
        
    <table style='border: 1px solid black';>
        <tbody>
        <tr">
            <th style='border: 1px solid black; text-align: center;'> Temperatura</th>
            <th style='border: 1px solid black; text-align: center;'> PH</th>
            <th style='border: 1px solid black; text-align: center;'> CO2</th>
            <th style='border: 1px solid black; text-align: center;'> Presion_Atmosférica</th>
            <th style='border: 1px solid black; text-align: center;'> Humedad (%)</th>
            <th style='border: 1px solid black; text-align: center;'> Fecha</th>
        </tr>`;

        result.forEach(element => {
            html += "<tr>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.temp + "</td>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.ph + "</td>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.co + "</td>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.pa + "</td>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.hum + "</td>"
            html += "<td style='border: 1px solid black; text-align:center'>" + element.fecha + "</td>"
            html += "</tr>"
        })

        html += `
        </tbody>
        </table>
        </div>`;


        html += `
        <div style="flex: 50%; text-align:center;">
        <hr>
        <h1> Alertas </h1>
        <hr>
    <table>
    <tbody>
        <tr>
            <th style='border: 1px solid black; text-align: center;'> Tipo</th>
            <th style='border: 1px solid black; text-align: center;'> Valor</th>
            <th style='border: 1px solid black; text-align: center;'> Fecha</th>
            <th style='border: 1px solid black; text-align: center;'> Cultivo</th>
        </tr>`;

        sql = `
        SELECT a.desc, a.value, r.fecha, r.id_cultivo
        FROM alerts a JOIN readings r on a.reading = r.id;
        `
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            result.forEach(element => {
                html += "<tr>"
                html += "<td style='border: 1px solid black; text-align:center'>" + element.desc + "</td>"
                html += "<td style='border: 1px solid black; text-align:center'>" + element.value + "</td>"
                html += "<td style='border: 1px solid black; text-align:center'>" + element.fecha + "</td>"
                html += "<td style='border: 1px solid black; text-align:center'>" + element.id_cultivo + "</td>"
                html += "</tr>"
            })

            html += `</tbody></table></div></div>`;
            res.send(html);
        })
    });




})

app.post('/save', (req, res) => {

    const sensor_data = req.body;
    let sql;
    let insert_id;
    let data = {};
    let alerts = [];
    try {

        sql = "INSERT INTO readings SET ?";
        data = {
            temp: sensor_data.temperature,
            ph: sensor_data.ph,
            co: sensor_data.co,
            pa: sensor_data.pa,
            hum: sensor_data.hum,
            id_cultivo: sensor_data.id_cultivo
        };

        db.query(sql, data,
            (err, result) => {
                if (err) {
                    console.log("ERROR IN READING:", err);
                    res.sendStatus(500);
                    return;
                }

                sql = "INSERT INTO alerts (`desc`, `value`, `reading`) VALUES ?;";
                insert_id = result.insertId;
                if (sensor_data.temperature < 18 || sensor_data.temperature > 24) {
                    data = ["TEMPERATURA", sensor_data.temperature, insert_id];
                    alerts.push(data);
                }
                if (sensor_data.ph < 5 || sensor_data.ph > 5.5) {
                    data = ["PH", sensor_data.ph, insert_id];
                    alerts.push(data);
                }
                if (sensor_data.co < 700 || sensor_data.co > 900) {
                    data = ["CO2", sensor_data.co, insert_id];
                    alerts.push(data);
                }
                if (sensor_data.pa < 18 || sensor_data.pa > 24) {
                    data = ["PRESIÓN_ATMOSFÉRICA", sensor_data.pa, insert_id];
                    alerts.push(data);
                }
                if (sensor_data.hum < 70 || sensor_data.hum > 85) {
                    data = ["HUMEDAD", sensor_data.hum, insert_id];
                    alerts.push(data);
                }

                db.query(sql, [alerts], (err) => {
                    if (err) {
                        console.log("ERROR IN ALERT:", err);
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(200);

                });
            });

    } catch (error) {
        res.sendStatus(500);
    }
});