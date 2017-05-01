var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');

var noteapp = express();

// view engine setup
noteapp.set('views', path.join(__dirname, 'views'));
noteapp.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//noteapp.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
noteapp.use(logger('dev'));
noteapp.use(bodyParser.json());
noteapp.use(bodyParser.urlencoded({ extended: false }));
noteapp.use(cookieParser());
noteapp.use(express.static(path.join(__dirname, 'public')));



mongoose.connect('mongodb://joon:1234@ds153730.mlab.com:53730/mern');

var Schema = mongoose.Schema;

var MemoSchema = new Schema({
    title     : String,
    body      : String,
    date      : {type: Date, default:Date.now}
});

var privateMemo = mongoose.model('privateMemo', MemoSchema);
var publicMemo = mongoose.model('publicMemo', MemoSchema);

/* GET home page. */
noteapp.get('/', function(req, res) {
  res.redirect('/public');
});

noteapp.get('/public', function(req, res) {
    if (req.query.title) {
        console.log(req.query.title)
        publicMemo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
            res.render('public', {memos: memos});
        })
    }
    publicMemo.find({}, (err, memos) => {
        res.render('public', {memos: memos});
    })
});

noteapp.get('/private', function(req, res) {
    if (req.query.title) {
        console.log(req.query.title)
        privateMemo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
            res.render('private', {memos: memos});
        })
    }
    privateMemo.find({}, (err, memos) => {
        res.render('private', {memos: memos});
    })
});

noteapp.get('/:id/add', (req, res) => {
    res.render('add', {type: req.params.id})
});

noteapp.post('/public', function(req, res) {
    var newMemo = new publicMemo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      console.log(newMemo)
      res.redirect('/public');
    });
});

noteapp.post('/private', function(req, res) {
  var newMemo = new privateMemo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      res.redirect('/private');
    });
});


noteapp.listen('3000', () => {
  console.log("1");
})

const {app, BrowserWindow} = require('electron')
const url = require('url')

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 멋대로 닫혀버립니다.
let win

function createWindow () {
  // 새로운 브라우저 창을 생성합니다.
  win = new BrowserWindow({width: 800, height: 600})

  // 그리고 현재 디렉터리의 index.html을 로드합니다.
  win.loadURL(url.format({
    pathname: 'localhost:3000',
    protocol: 'http:',
    slashes: true
  }))

  // 개발자 도구를 엽니다.
  // win.webContents.openDevTools()

  // 창이 닫히면 호출됩니다.
  win.on('closed', () => {
    // 윈도우 객체의 참조를 삭제합니다. 보통 멀티 윈도우 지원을 위해
    // 윈도우 객체를 배열에 저장하는 경우가 있는데 이 경우
    // 해당하는 모든 윈도우 객체의 참조를 삭제해 주어야 합니다.
    win = null
  })
}

// 이 메서드는 Electron의 초기화가 끝나면 실행되며 브라우저
// 윈도우를 생성할 수 있습니다. 몇몇 API는 이 이벤트 이후에만
// 사용할 수 있습니다.
app.on('ready', createWindow)

// 모든 창이 닫히면 애플리케이션 종료.
app.on('window-all-closed', () => {
  // macOS의 대부분의 애플리케이션은 유저가 Cmd + Q 커맨드로 확실하게
  // 종료하기 전까지 메뉴바에 남아 계속 실행됩니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에선 보통 독 아이콘이 클릭되고 나서도
  // 열린 윈도우가 없으면, 새로운 윈도우를 다시 만듭니다.
  if (win === null) {
    createWindow()
  }
})

// 이 파일엔 제작할 애플리케이션에 특화된 메인 프로세스 코드를
// 포함할 수 있습니다. 또한 파일을 분리하여 require하는 방법으로
// 코드를 작성할 수도 있습니다.
