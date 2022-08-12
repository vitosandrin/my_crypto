const router  = require('express').Router()

const WalletController = require('../controllers/WalletController')

const verifyToken = require('../helpers/verify-token')

router.post('/create', verifyToken, WalletController.create)

router.get('/mywallets', verifyToken, WalletController.getAllUserWallet)
router.get('/:id', WalletController.getWalletById)

router.patch('/:id', verifyToken, WalletController.updateWallet)

router.delete('/:id', verifyToken, WalletController.removeWalletById)

module.exports = router