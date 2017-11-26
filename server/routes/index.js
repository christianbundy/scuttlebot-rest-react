var express = require('express');
var pull = require('pull-stream')
var router = express.Router();
var ssbClient = require('ssb-client')
var ssbKeys = require('ssb-keys')
var ssbServer = require('scuttlebot').use(require('scuttlebot/plugins/master'))


var keys = ssbKeys.loadOrCreateSync('/mnt/secrets/app-private.key')
var server = ssbServer({
  port: 8008, timeout: 2001,
  temp: 'connect',
  host: 'database',
  master: keys.id,
  keys: keys
})

var getSbot = new Promise(function (resolve, reject) {
  ssbClient( keys, {
    manifest: server.manifest()
  },
  function (err, sbot) {
    if (err) {
      reject(err)
    }

    resolve(sbot)
  })
});

router.get('/', function(req, res, next) {
  res.json({data: null})
});

router.get('/whoami', function(req, res, next) {
  getSbot.then(function (sbot) {
    sbot.whoami(function (err, info) {
      if (err) { 
        res.json({errors: err})
      } else {
        res.json({ data: info });
      }
    })
  }).catch(function (err) {
    res.json({errors: [err]})
  })
});

router.get('/create-user-stream', function(req, res, next) {
  getSbot.then(function (sbot) {
    pull(
      sbot.createUserStream({ id: req.query.id }),
      pull.collect(function (err, msgs) {
        if (err) { 
          res.json({errors: err})
        } else {
          res.json({ data: msgs });
        }
      })
    )
  }).catch(function (err) {
    res.json({errors: [err]})
  })
});

router.post('/publish', function(req, res, next) {
  getSbot.then(function (sbot) {
    sbot.publish(req.body, function (err, msg) {
      if (err) {
        res.json({errors: err})
      } else {
        res.json({ data: msg });
      }
    })
  }).catch(function (err) {
    res.json({errors: [err]})
  })
});
module.exports = router;
