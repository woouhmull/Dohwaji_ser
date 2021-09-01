const express = require('express');
const spawn = require('child_process').spawn;

const app = express();
// body-parser => req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('cors')())


app.listen(3000, () => {
    console.log('서버 실행중')
})
