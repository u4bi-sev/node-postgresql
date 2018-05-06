## node postgresql

### server
```
npm install
npm start
```

### client(CORS)
```
http://127.0.0.1:5500/client/index.html
```

### API
| URL                       | METHOD |
|---------------------------|--------|
| /user                     | GET    |
| /user/:id                 | GET    |
| /user                     | POST   |
| /user/:id                 | PUT    |
| /user/:id                 | DELETE |

### Table
```sql
CREATE TABLE _user (
    id SERIAL PRIMARY KEY,
    name varchar(32),
    pay double precision,
    age integer
);
```

> requirements
> * pg-promise
> * restify
> * restify-cors-middleware
> * axios (client)