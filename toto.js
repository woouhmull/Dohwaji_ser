const express = require('express');

const app = express();
// body-parser => req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('cors')())


app.listen(3001, () => {

    console.log('서버 실행중')
    setTimeout(() => console.log('Data in'),7000);
    setTimeout(() => console.log('37'),1000);
    
})
