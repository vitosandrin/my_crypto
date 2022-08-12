//Config require
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

//Config JSON response
app.use(express.json())

//Solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Public folder for img
app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/user.routes')
const WalletRoutes = require('./routes/wallet.routes')

app.use('/users', UserRoutes)
app.use('/wallet', WalletRoutes)

//Ports
app.listen(3333, () => console.log('Server Running!'))