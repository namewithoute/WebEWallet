var router=require('express').Router()

var adminMD=require('../middleware/admin')
const checkRole = require('../middleware/checkRole')

router.get('/',checkRole)
router.get('/account',checkRole,adminMD.adminHomeGET)
router.get('/account/wait-active',checkRole,adminMD.adminWaitActiveGET)
router.get('/account/active',checkRole,adminMD.adminActiveGET)
router.get('/account/lock',checkRole,adminMD.adminLockGET)
router.get('/account/disable',checkRole,adminMD.adminDisableGET)

router.get('/account/:id',checkRole,adminMD.getOneUser)

router.get('/history-transaction/pending',checkRole,adminMD.adminHTrsPendingGET)
router.get('/history-transaction/success',checkRole,adminMD.adminHTrsSuccessGET)
router.get('/history-transaction/all',checkRole,adminMD.adminHTrsAllGET)
router.get('/history-transaction/:id',checkRole,adminMD.adminHTrsDetailGET)



module.exports=router