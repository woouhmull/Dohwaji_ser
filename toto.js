const express = require('express');

const app = express();
// body-parser => req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('cors')())


app.listen(3001, () => {
    async () =>{
      console.log('서버 실행중')
      await sleep(7000);
      console.log('Data in')
      await sleep(1000);
      console.log('37');
    }
})
const sleep = (ms) => {
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }
