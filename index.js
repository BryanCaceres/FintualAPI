require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routerApi  = require('./routes');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get(process.env.HEALTH_INDEX, (req, res) => {
  const data = {
    state: "Papi, tamo activos",
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }

  res.status(200).send(data);
});

routerApi(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://127.0.0.1:${port}/`);
});

