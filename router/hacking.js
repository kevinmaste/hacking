const express = require('express')
const router = express.Router()
const {getInfos,readInfos,sendingEmail} = require('../controller/hacking')




router.get('/info',getInfos)
router.get('/read',readInfos)
router.post('/send/',sendingEmail)




module.exports=router