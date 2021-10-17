require('dotenv').config;
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // .env dosyasında belirttiğimiz adrese Redis bağlantısı kurar.

exports.listenerProcessedUser = async (channel) => {
    redis.subscribe(channel, (err, count) => {
        if (err) {
            console.log('Kanala bağlanılamadı.. Hata: %s', err.message);
        } else {
            console.log(`Kanal dinlenmeye başlandı.. Dinlenilen kanal sayısı: ${count}`);
        }
    })

    redis.on('message', (channel, message) => {
        console.log('Kullanıcı bilgileri başarıyla alındı...');
        console.log('Kullanıcı bilgileri: ', message)
        return JSON.parse(message);
    })
}
