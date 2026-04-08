const express = require('express')
const path = require("path");
const { logEvents, logMW } = require('./src/log');
const {onError} = require("./src/errorHandler")
const cors = require("cors")

const app = express()
const PORT = 5899
// Middleware
app.use((req, res, next)=> {
    logMW(req, res, next)
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/data", express.static(path.join(__dirname, "data")));
app.use(logMW)

const whiteList = [
  "http://127.0.0.1:550",
  "http://localhost:3000",
  "https://www.google.com/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionScuccessStatus: 200,
};

app.use(cors(corsOptions));


// function firstHandler(req, res, next) {
//     console.log('First handler executed');
//     req.data = 'Data from first handler';
//     next();
// }
 
// function secondHandler(req, res, next) {
//     console.log('Second handler executed');
//     req.data += ' | Data from second handler';
//     next();
// }
 
// function finalHandler(req, res) {
//     console.log('Final handler executed');
//     res.send(`Final Response: ${req.data}`);
// }
 
// app.get('/multi', firstHandler, secondHandler, finalHandler);
// // Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});
 
app.get('/user/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name}`);
});
 
app.get('/user/:userId/book/:bookId', (req, res) => {
    const { userId, bookId } = req.params;
    res.send(`User ID: ${userId}, Book ID: ${bookId}`);
});

app.get('/user/:id{0,1}', (req, res) => {
    const userId = req.params.id || 'No ID provided';
    res.send(`User ID: ${userId}`);
});

app.post('/submit', (req, res) => {
    res.send('Form Submitted Successfully');
});
 
app.put('/update', (req, res) => {
    res.send('Data Updated Successfully');
});
 
app.delete('/delete', (req, res) => {
    res.send('Data Deleted Successfully');
});

app.get('/old-page', (req, res) => {
    res.redirect(301, '/new-page');
});
 
app.get('/new-page', (req, res) => {
    res.sendFile(path.join(__dirname, "src", 'views', 'new-page.html'));
});

app.get("/uh-oh", (req, res)=> {
    throw new Error("This is a runtime error!")
})

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "404.html"));
});

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, "src", 'views', 'index.html'));
});

app.use(onError)

app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}`)
})