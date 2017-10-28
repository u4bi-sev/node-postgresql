const config  = require('./model/config'),
      restify = require('restify'),
      corsMiddleware = require('restify-cors-middleware');

/* cross origin http */
const cors = corsMiddleware( { origins: ['http://127.0.0.1:5500'] } );
const server = restify.createServer({
    name    : config.name,
    version : config.version,
    url     : config.hostname
});


const db = config.db.get();
config.db.open(db);


server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);
server.use((req, res, next) => {
    // access token
    console.log(new Date(), req.method, req.url);
    next();
});


server.get('/user', (req, res) => {
    db.any('SELECT * FROM _user')
        .then((results) => res.end(JSON.stringify(results)))
        .catch((error) => { throw error });
});


server.get('/user/:id', (req, res) => {    
    db.one('SELECT * FROM _user WHERE id = $1', req.params.id)
        .then((results) => res.end(JSON.stringify(results)))
        .catch((error) => { throw error });
});


server.post('/user', (req, res) => {
    
    let sql = `INSERT INTO _user (
                    name,
                    pay,
                    age)
                VALUES(
                    $1, $2, $3
                ) RETURNING *`;

    db.one(sql,
        [
            req.body.name,
            req.body.pay,
            req.body.age
        ])
        .then(results => res.end(JSON.stringify(results)) )
        .catch((error) => { throw error });
});

/*  db.one  - https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example#insert-with-result
    db.none - https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example#simple-insert */

server.put('/user/:id', (req, res) => {
    
    let sql = `UPDATE _user
               SET
                    name = $1,
                    pay = $2,
                    age = $3
               WHERE
                    id = $4
               RETURNING *`;

    db.one(sql,
        [
            req.body.name,
            req.body.pay,
            req.body.age,
            req.params.id
        ])
        .then(results => res.end(JSON.stringify(results)) )
        .catch((error) => { throw error });
});


server.del('/user/:id', (req, res) => {
    db.result('DELETE FROM _user WHERE id = $1', req.params.id)
        .then(results => {
            let data = { id : req.params.id , message : 'deleted user' };            
            res.end(JSON.stringify(data));
        })
        .catch((error) => { throw error });
});        

server.listen(7776, () => console.log(server.name, server.url));