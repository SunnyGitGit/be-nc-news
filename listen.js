const app = require("./app");
const { PORT = 9000 } = process.env;

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}...`));