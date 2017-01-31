const express = require('express');

const app = express();
app.use('*', (req, res) => {
  res.send("Hello from the WEBSITE");
});

app.listen(process.env.PORT || 3000);
