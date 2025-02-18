const app = require("./app");
const { PORT = 9090 } = process.env;

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}...`));