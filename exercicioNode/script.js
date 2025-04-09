const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let carrosData = fs.readFileSync(carrosPath, 'utf-8');
let carros = JSON.parse(carrosData);

function saveDados() {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 4));
}
function findCarroByName(nome) {
    return carros.find(carro => carro.nome.toLowerCase() === nome.toLowerCase());
}

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'carros.json'))
})

app.get('/add-car', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionar_carro.html'));
});

app.post('/add-car', (req, res) => {
    const newCarro = req.body;
    if (carros.find(car => car.nome.toLowerCase() == newCarro.nome.toLowerCase())) {
    res.send('<h1>Car already exists. Cannot add duplicates.</h1>');
    return;
    }

    carros.push(newCarro);
    saveDados();
    res.send('<h1>Car added successfully!</h1>');
    });

    app.get('/cars/classics', (req, res) => {
    fs.readFile(path.join(__dirname, 'carros_classicos.json'), 'utf-8', (err, data) => {
    if (err) {
    res.status(500).send('Error reading classics cars file.');
    return;
    }
    res.json(JSON.parse(data));
    });
    });

    app.get('/cars/sports', (req, res) => {
    fs.readFile(path.join(__dirname, 'carros_esportivos.json'), 'utf-8', (err, data) => {
    if (err) {
    res.status(500).send('Error reading sports cars file.');
    return;
    }
    res.json(JSON.parse(data));
    });
    });

    app.get('/cars/luxury', (req, res) => {
    fs.readFile(path.join(__dirname, 'carros_luxo.json'), 'utf-8', (error, data) => {
    if (error) {
    res.status(404).send('Error reading luxury cars file.');
    return;
    }
    res.send(JSON.parse(data));
    });
    });

    app.get('/cars/:nome', (req, res) => {
    const carName = req.params.nome;
    const carroFound = findCarroByName(carName);
    if (carroFound) {
    res.json(carroFound);
    }
    else {
    res.status(404).send('<h1>Car not found.</h1>');
    }
    });
    app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    });