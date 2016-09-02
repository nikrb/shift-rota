react implementation of shift rota system.
Got here using many tutorials, in particular:

* React main site tutorials : https://github.com/nikrb/products
* fcc : https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/Setting-Up-A-React-ES6-Webpack-Project
* LearnCode.academy on youtube series up to flux - no redux yet. Note the following repos branch names rougly correspond to the video titles:
  * https://github.com/nikrb/learn2react
  * https://github.com/nikrb/learn2flux
* so many examples, tutorials and articles on stack overflow.

To start:

1. get mongo running
2. init db with scripts/init.mongo.js
2. run the server (nodemon to update on change)
   * unixy: npm start
   * dos  : npm run dos-start
3. run webpack to watch for front end changes
   webpack --watch

Been developing on local win7 machine so unixy version may need some attention to get it to work.

To restore mongo to testdb from dumps directory:

```
mongorestore --db rotadb --drop dump/rotadb
```

### On the way here ...

trying to run backend api with webpack
finding process:
lsof -i tcp:$PORT

running webpack for react from cloud9:
```
webpack-dev-server --port $PORT --host $IP  --content-base dist/
```

*note $port and $ip seem to be already defined in workspace.*

react sass template.

point browser at:
https://react-sass-template-knik.c9users.io/



     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--,
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    -----------------------------------------------------------------


Welcome to your Node.js project on Cloud9 IDE!

Based on the cloud9 ide nodejs chat server starting template.
