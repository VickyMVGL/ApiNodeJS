import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.log('Error reading file', error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.log('Error writing file', error);
    }
};


app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get("/drivers", (req, res) => {
    const data = readData();
    res.json(data.drivers);
});

app.get("/drivers/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const driver = data.drivers.find((driver) => driver.id === id);
    res.json(driver);

});

app.post("/drivers", (req, res) => {
    const data = readData();
    const body = req.body;
    const newDriver = {
        id: data.drivers.length + 1,
        ...body,
    };
    data.drivers.push(newDriver);
    writeData(data);
    res.json(newDriver);
});

app.put("/drivers/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;
    const driverIndex = data.drivers.findIndex((driver) => driver.id === id);
    data.drivers[driverIndex] = {
        ...data.drivers[driverIndex],
        ...body,
    };
    writeData(data);
    res.json(data.drivers[driverIndex]);
});

app.delete("/drivers/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const driverIndex = data.drivers.findIndex((driver) => driver.id === id);
    data.drivers.splice(driverIndex, 1);
    writeData(data);
    res.json(data.drivers);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
