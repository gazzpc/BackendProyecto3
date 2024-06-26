const { Router } = require('express');
const { check } = require('express-validator')


const {
    getPrincipalUser,
    getPrincipalUserList,
    getFilterStatusUser,
    getFilterPaidUser,
    postPrincipalUser,
    putPrincipalUser,
    enablePrincipalUser,
    disablePrincipalUser,
    userPayDone,
    borrarUsuario } = require('../controllers/principalUserController');

const { validatesFields } = require('../middlewares/validatesFields');
const { emailExiste } = require('../helpers/db-validator');

const router = Router();


router.get('/principalUsers/:id', getPrincipalUser);
router.get('/principalUsers', getPrincipalUserList);
router.get('/principalUsers/status/:status', getFilterStatusUser);
router.get('/principalUsers/paid/:paid', getFilterPaidUser);
router.post('/principalUsers', postPrincipalUser);
router.put('/principalUsers/:id', putPrincipalUser);
router.put('/principalUsers/enable/:id', enablePrincipalUser);
router.put('/principalUsers/disable/:id', disablePrincipalUser);
router.put('/principalUsers/pay-done/:id', userPayDone);
router.delete('/principalUsers/borrar/:id', borrarUsuario);

module.exports = router;