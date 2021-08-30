const express = require('express');
const db = require('./db');
const spawn = require('child_process').spawn;

const app = express();
// body-parser => req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('cors')())


let myDB = null;
(async () => {
    myDB = await db();
})()


//http://localhost:3000/
//로그인하는 주소
app.post('/user/login', async (req, res) => {
    let collection = myDB.db('ye').collection('yelection')
    //query 보내서 이메일 이메일과 일치하는 애를 data에 저장
    const data = await collection.findOne({email: {$eq:req.body.email} })
    var auth=null;
    if(data!=null){
      //가져온 이메일의 비밀번호와 입력된 비밀번호가 같으면
      if(data.password ==req.body.password && data.name == req.body.name){
        //정보 완벽!
        auth=1;
      }
      else{
        //이메일 정보는 있는데, 비밀번호,이름이 틀릴 때
        auth =0;
      }
    }
    else{
      auth =2;//이메일이 없을 때
    }


    res.json({
      'code': auth
    })
    //res.write(auth);
    //res.end();

    console.log(auth)
})

//회원가입하는 포스트
app.post('/user/register', async (req, res) => {
    let collection = myDB.db('ye').collection('yelection')
    //데이터를 찾아온다 이메일과 동일한 부분을
    const check_e = await collection.findOne({email: {$eq:req.body.email} })
    const check_n = await collection.findOne({name: {$eq:req.body.name} })

    //중복 체크 1인경우 중복
    var overlap = null
    if(check_e == null && check_n == Null){

      myDB.db('ye').collection('yelection').insertOne(req.body);
      overlap =0;
    }
    else{
      overlap = 1;
    }
    //데이터 전송
    res.json({
      'code': overlap
    })
    console.log(overlap)
})

//질문에 대한 대답을 받는 포스트
app.post('/user/answer', async (req, res) => {
    let collection = myDB.db('ye').collection('answer')
    s=req.body.answer
    //collection 으로 바꿔보기
    collection.insertOne(req.body);

    if(req.body.number >= 1 && req.body.number <= 5)
    {
      const process1 = spawn('python', ['./Extroversion.py', s]);
      const process2 = spawn('python', ['./YesNo.py', s]);
      console.log(req.body)
      process1.stdout.on('data', data1 => {
      console.log(data1.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result1" :parseInt(data1.toString()[1])}});
    });
      process2.stdout.on('data', data2 => {
      console.log(data2.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result2" :parseInt(data2.toString()[1])}});
    });
  }



    else if(req.body.number >= 6 && req.body.number <= 10)
    {
      const process1 = spawn('python', ['./Openness.py', s]);
      const process2 = spawn('python', ['./YesNo.py', s]);
      console.log(req.body)
      process1.stdout.on('data', data1 => {
      console.log(data1.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result1" :parseInt(data1.toString()[1])}});
      });
      process2.stdout.on('data', data2 => {
      console.log(data2.toString()[1]*1);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result2" :parseInt(data2.toString()[1])}});
      });
  }


    else if(req.body.number >= 11 && req.body.number <= 15)
    {
      const process1 = spawn('python', ['./Agreeableness.py', s]);
      const process2 = spawn('python', ['./YesNo.py', s]);
      console.log(req.body)
      process1.stdout.on('data', data1 => {
      console.log(data1.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result1" :parseInt(data1.toString()[1])}});
    });
      process2.stdout.on('data', data2 => {
      console.log(data2.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result2" :parseInt(data2.toString()[1])}});
    });
  }

    else if(req.body.number >= 16 && req.body.number <= 20)
    {
      const process1 = spawn('python', ['./Conscientiousness.py', s]);
      const process2 = spawn('python', ['./YesNo.py', s]);
      console.log(req.body)
      process1.stdout.on('data', data1 => {
      console.log(data1.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result1" :parseInt(data1.toString()[1])}});
      });
      process2.stdout.on('data', data2 => {
      console.log(data2.toString()[1]);
      var ID = req.body._id
      collection.updateOne({_id: ID},{$set: {"result2" :parseInt(data2.toString()[1]*1)}});
      });
  }
  res.json({
    "Endflag": await endflag
  })

})
//결과 분석 포스트
app.post('/user/result', async (req, res) => {
  let collection = myDB.db('ye').collection('answer')
//데이터를 찾아온다 이메일과 동일한 부분을
  var re_E=0;
  var re_A=0;
  var re_O=0;
  var re_C=0;

  var type=['E','O','A','C']
  for(var j=0;j<4;j++){
    var check1=0
    var check2=0

    if (j == 0)
    {var i = 1;}
    else if(j == 1)
    {var i = 6;}
    else if (j == 2)
    {var i = 11;}
    else
    {var i = 16;}

    for(var p = i;p <= i+4; p++)
    {
      var tmp = await collection.findOne({$and: [ {"name": {$eq:req.body.name}},{"number":p}]})

      check1 +=tmp.result1
      check2 +=tmp.result2
    }
    eval("re_"+type[j]+"=(check1 + check2*0.7+ (5-check2)*0.3)/5")
    }

    console.log(re_E)
    console.log(re_O)
    console.log(re_A)
    console.log(re_C)

  if(re_E<1){
    finE="I"
  }
  else{
    finE="E"
  }
  if(re_O<1){
    finO="C"
  }
  else{
    finO="O"
  }
  if(re_A<1){
    finA="R"
  }
  else{
    finA="G"
  }
  if(re_C<1){
    finC="Z"
  }
  else{
    finC="P"
  }
  console.log(finE+finO+finA+finC)
  myDB.db('ye').collection('result').insertOne({"name":req.body.name,"result":finE+finO+finA+finC})

  res.json({
    "result": finE+finO+finA+finC
  })
})

app.listen(3000, () => {
    console.log('서버 실행중')
})