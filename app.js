const express=require('express');
const app=express()
const mongoose=require('mongoose');
const {Schema}=mongoose;
const bodyParser=require('body-parser')
require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'))
app.set('view engine', 'ejs');

mongoose.connect(process.env.url);
const starting= new Schema({
  content:String,
  type:String,
});

const data=mongoose.model('Do',starting)


app.get('/',function(req,res){
  async function finding(){
    const home=await data.find({type:'Today'})
    res.render('list',{newListItems:home,listTitle:'Today'})
  }
  finding();
});

app.post('/',function(req,res){
  const con=req.body.newItem
  if(req.body.list=='Today'){
    const dt=new data({content:con,type:'Today'})
    dt.save().then(function(){
      console.log('added successfully ')
      res.redirect('/')
    })

  }else{
    const dt=new data({content:con,type:req.body.list})
    dt.save().then(function(){
      console.log('added successfully ')
        res.redirect('/'+req.body.list)
    })

  }

});

app.post('/delete',function(req,res){
  var key=Object.keys(req.body)[0]
  async function deleting(){
    const db=await data.findById(key)
    if(db.type=='home'){
      await data.deleteOne({_id:key})
      res.redirect('/')
    }else{
      await data.deleteOne({_id:key})
      res.redirect('/'+db.type)
    }

  }
deleting();
});

app.get('/:random',function(req,res){
  async function special(){
    const home=await data.find({type:req.params.random})
    res.render('list',{newListItems:home,listTitle:req.params.random})
  }
  special();
})

app.listen(3000,function(){
  console.log('Server running in port 3000')
});
