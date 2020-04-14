const express = require('express')
const crypto = require('crypto');
const { execSync } = require("child_process");
const app = express()
const { SECRET, PORT } = process.env;

app.use(express.json());

const deploy = () => {
    console.log("Start Deploy");
    execSync('git fetch --all', { stdio: 'inherit' });
    execSync('git reset --hard origin/master', { stdio: 'inherit' });
    console.log("End Deploy");
}

const isRequestValid = ({ body, headers }) => {
    const hash = "sha1=" + crypto.createHmac('sha1', SECRET).update(JSON.stringify(body)).digest('hex');
    return hash === headers['x-hub-signature'];
}

app.post('/', (req, res) => {
    console.log("Request Received");

    if (!isRequestValid(req)) {
        console.log('Invalid Key');
        return res.status(404).json({ "error": "invalid key", key: hash });
    }

    deploy();

    res.status(200)
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))