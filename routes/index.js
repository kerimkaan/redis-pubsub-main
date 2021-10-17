require('dotenv').config;

var express = require('express');
const Redis = require('ioredis');
var router = express.Router();
const redis = new Redis(process.env.REDIS_URL); // .env dosyasında belirttiğimiz adrese Redis bağlantısı kurar.

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Kullanıcıdan aldığı bilgileri `userdata` kanalına gönderir.
router.post('/saveUserData', (req, res, next) => {
  const { username, name, surname, role } = req.headers;
  const userData = { username, name, surname, role };
  redis.publish('userdata', JSON.stringify(userData)).then((data) => {
    console.log('Kullanıcı bilgileri başarıyla gönderildi..');
    res.json({ message: 'Kullanıcı bilgileri başarıyla gönderildi.' });
  }).catch((err) => {
    console.log('Kullanıcı bilgileri gönderilemedi..');
    res.status(500).json({ message: 'Kullanıcı bilgileri iletilemedi', hata: err });
  })
  
});

router.get('/getUserData/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: 'ID parametresi girilmelidir.' });
  } else {
    const redis = new Redis(process.env.REDIS_URL); // İlk Redis bağlantısı publisher için kullanıldığından yeni bağlantı kurulur.
    const getUserFromRedis = await redis.get(`user:${id}`)
    if (getUserFromRedis) {
      res.json(JSON.parse(getUserFromRedis));
    } else {
      res.status(500).json({ message: 'İlgili ID\'li kullanıcı bulunmamaktadır.', id});
    }
  }
});

module.exports = router;
