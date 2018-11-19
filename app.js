
var {Readable, Writable} = require('stream');
var express = require("express");
const EventEmitter = require('events');
var app = new express ();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const myEE = new EventEmitter();

var Log = require('log'),
    log = new Log('debug')

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

let st, wr;

class RVideoStream extends Readable {
  constructor(options) {
    super({
      ...options,
      objectMode: true
    })
  }
  
  _read() {
    console.log('read!!!!!')
  }
}

class WVideoStream extends Writable {
  constructor(readableStream) {
    super();
    this.readable = readableStream;
  }

  _write(data, encoding, callback){
    console.log('write')
    this.readable.push(data);
    callback()
  }
}


app.get('/',function(req,res){
    res.redirect('index.html'); //para archivos estaticos
});

app.get('/video',function(req,res){
    if(st){
      res.set('Content-Type', 'video/webm');
      res.set("Connection", "keep-alive");
      st.pipe(res);
    } else {
      res.sendStatus(404)
    }
});

io.on('connection',function(socket){
  st = new RVideoStream();
  wr = new WVideoStream(st);
  socket.on('stream',(data) => {
    console.log('data')
    if(data){
      if (!wr.write(data)) {
        wr.once('drain', ()=>{});
      } else {
        process.nextTick(() => {});
      }
    }
  });
});

http.listen(port,function(){
    log.info('Servidor escuchando por el puerto %s',port);
});
