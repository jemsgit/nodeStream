
var {Readable} = require('stream');
var express = require("express");
var app = new express ();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var Log = require('log'),
    log = new Log('debug')

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

var st;



class VideoStream  extends Readable{
  constructor(options) {
    super({
      ...options,
      objectMode: true
    })

    this.socket = options.socket;
    this.chunks = []
  }


  getDataFn = async function() {
    return new Promise((res, rej) => {
      this.socket.on('stream',(data) => {
        console.log('data')
        console.log(data);
        res(data);
        this.push(data);
      });
    });
  }

  getData = getDataFn();
  
  

  _read() {
    let data = getData();
    if(!data) {
      set
    }
  }


}


app.get('/',function(req,res){
  res.redirect('index.html'); //para archivos estaticos
});

app.get('/video',function(req,res){
  console.log(st)
  if(st){
    st.pipe(res);
  } else {
    res.sendStatus(404)
  }
  
});

io.on('connection',function(socket){
  st = new VideoStream({socket});
});

http.listen(port,function(){
    log.info('Servidor escuchando por el puerto %s',port);
});
