const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser  = require('body-parser');
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: 'mariadb', port: 3306, user: 'root', password: 'root', database: 'tp3'});
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  pool.getConnection()
    .then(conn => {
      conn.query("SELECT * from articles")
        .then((result) => {
          console.log(result);
          conn.end();
          res.json({data: result, success: true});
        })
        .catch(err => {
          console.log(err);
          conn.end();
          res.json({error: err, success: false});
        })

    }).catch(err => {
      console.log(err);
      res.json({error: err, success: false});
    });

})

app.post('/', (req, res) => {
  console.log(req.body);
  if(req.body) {
    pool.getConnection()
        .then(conn => {
          conn.query("INSERT INTO articles value (?, ?, ?, ?, ?)", [req.body.title, req.body.author, req.body.status, req.body.section, req.body.ts])
            .then((result) => {
              console.log(result);
              conn.end();
              res.json({data: result, success: true});
            })
            .catch(err => {
              console.log(err);
              conn.end();
              res.json({error: err, success: false});
            })
        }).catch(err => {
          console.log(err);
          res.json({error: err, success: false});
        });
  } else {
    res.json({error: 'no body', success: false});
  }

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))