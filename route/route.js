var router = require('express').Router()
// var fire = require('./fire')
var bodyParser = require('body-parser')
// var db = fire.firestore()
router.use(bodyParser.json())

let tbAfkVoice = "afkVoice"
let tbTimeVoice = "timeVoice"
let eventdb = "eventdb"

// function saveAfk(id_member,id_channel,jumlah,res){
//     let qty=jumlah;

//     if(qty>0){
//         qty=parseInt(qty)+1
//         db.collection(tbAfkVoice).where("id_member", "==", id_member)
//         .where("id_channel", "==", id_channel).get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 doc.ref.update({jumlah:qty})
//             });
//         })
//     }else{
//         qty=1
//         db.collection(tbAfkVoice).add({
//             id_member,
//             id_channel,
//             jumlah:qty,
//             waktu: new Date()
//         })
//     }
    
//     res.send({
//         id_member,
//         id_channel,
//         jumlah:qty,
//         waktu: new Date()
//     })
// }

// function saveTimeStart(id_member){
//     db.collection(tbTimeVoice)
//     .where('id_member', '==', id_member).get()
//     .then(snapshot => {
//         if(!snapshot.empty) {
//             let data = snapshot.docs[0].data()
//             let total_waktu = data.total_waktu
//             db.collection(tbTimeVoice).where("id_member", "==", id_member).get()
//             .then(function(querySnapshot) {
//                 querySnapshot.forEach(function(doc) {
//                     doc.ref.update({
//                         waktuAwal: new Date(),
//                         waktuAkhir: new Date(),
//                         total_waktu
//                     })
//                 });
//             })
//         }else{
//             db.collection(tbTimeVoice).add({
//                 id_member,
//                 waktuAwal: new Date(),
//                 waktuAkhir: new Date(),
//                 total_waktu:0
//             })
//         }
//     }).catch((error)=>{
//         console.log(error)
//     })
// }

// function saveTimeLast(id_member,res){
//     let lastTime = new Date()

//     db.collection(tbTimeVoice)
//     .where('id_member', '==', id_member).get()
//     .then(snapshot => {
//         let total_waktu
//         let data = snapshot.docs[0].data()
//         let newTime = data.waktuAwal
//         if(data.total_waktu == 0){
//             let hr = (Math.round(lastTime.getTime()/1000)) - newTime.seconds;
//             total_waktu = Math.abs(Math.round(hr));
//         }else{
//             let hr = (Math.round(lastTime.getTime()/1000)) - newTime.seconds;
//             total_waktu = parseInt(data.total_waktu)+Math.abs(Math.round(hr));
//             console.log(total_waktu)
//         }

//         db.collection(tbTimeVoice).where("id_member", "==", id_member).get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 doc.ref.update({total_waktu, waktuAkhir:lastTime})
//             });
//         })
       
//         res.send({waktu:total_waktu})
//     }).catch((error)=>{
//         console.log(error)
//     })
// }

// router.get('/data', (req, res)=>{
//     var allData = []
//     db.collection(tbAfkVoice)
//     .orderBy('waktu', 'desc').get()
//     .then(snapshot => {
//         snapshot.forEach((hasil)=>{
//             allData.push(hasil.data())
//         })
//         // console.log(allData)
//         res.send(allData)
//     }).catch((error)=>{
//         console.log(error)
//     })
// })

// router.post('/savenew', (req, res)=>{
//     let id = req.body.id_member
//     let channel = req.body.id_channel
//     saveTimeStart(id)
//     db.collection(tbAfkVoice)
//     .where('id_member', '==', id)
//     .where('id_channel', '==', channel).get()
//     .then(snapshot => {
//         if(!snapshot.empty) {
//             let data = snapshot.docs[0].data()
//             // console.log(data.jumlah)
//             saveAfk(id,channel,data.jumlah,res)
//         }else{
//             saveAfk(id,channel,0,res)
//         }
//     }).catch((error)=>{
//         console.log(error)
//     })
// })

// router.post('/saveold', (req, res)=>{
//     let id = req.body.id_member
//     saveTimeLast(id,res)
// })

// router.post('/voiceTime', (req, res)=>{
//     let id = req.body.id_member
//     db.collection(tbTimeVoice)
//     .where('id_member', '==', id).get()
//     .then(snapshot => {
//         if(!snapshot.empty) {
//             let data = snapshot.docs[0].data()
//             res.send({waktu:data.total_waktu})
//         }else{
//             res.send({waktu:0})
//         }
//     }).catch((error)=>{
//         console.log(error)
//     })
// })

router.post('/checkPass', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let id_member = req.body.id_member
    let nama_member = req.body.nama_member
    let password = req.body.password

    console.log(`${id_member} ${nama_member} ${password}`)

    db.collection(eventdb)
    .where('id_member', '==', id_member).get()
    .then(snapshot => {
        if(!snapshot.empty) {
            db.collection(eventdb)
            .where('id_member', '==', id_member)
            .where('password', '==', password).get()
            .then(snapshot2 => {
                if(!snapshot2.empty) {
                    res.send({info:"Password Benar"})
                }else{
                    res.send({info:"Password Salah"})
                }
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            db.collection(eventdb).add({
                id_member,
                nama_member,
                password,
                first_date: new Date(),
                last_date: new Date(),
                point_puzzle:0,
                point_quiz:0,
                point_void:0,
                time_void:0,
                time_puzzle:0,
                time_quiz:0,
                score_void:0,
                score_puzzle:0,
                score_quiz:0,
                total_point:0,
                request:false
            }).then(val=> {
                res.send({info:"Data Disimpan"})
            }).catch((error)=>{
                console.log(error)
            })
        }
    }).catch((error)=>{
        console.log(error)
    })
})

module.exports = router