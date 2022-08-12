const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class UserController {

    static async register(req, res) {
        const { username, email, password, confirmpassword } = req.body

        //Validations
        if (!username) {
            res.status(422).json({ message: 'O username é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação da senha é obrigatória!' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: '!A senha e a confirmação da senha não são iguas!' })
            return
        }

        const emailExists = await User.findOne({ email: email })
        const usernameExists = await User.findOne({ username: username })

        if (emailExists) {
            res.status(422).json({ message: 'E-mail já cadastrado!' })
            return
        }
        if (usernameExists) {
            res.status(422).json({ message: 'Username já cadastrado!' })
            return
        }

        //Create password
        const salt = await bcrypt.genSalt(12) //12 char a mais
        const passwordHash = await bcrypt.hash(password, salt)

        //Create User
        const user = new User({
            username,
            email,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async login(req, res) {

        const { username, password } = req.body

        if (!username) {
            res.status((422)).json({ message: 'O username é obrigatório!' })
            return
        } else if (!password) {
            res.status((422)).json({ message: 'A senha é obrigatória!' })
            return
        }

        const user = await User.findOne({ username: username })

        if (!user) {
            res.status(422).json({
                message: 'Usuário inexistente no banco de dados!'
            })
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({
                message: 'Senha invalida!'
            })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret') //Decode token

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined //Hidden password
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado!'
            })
            return
        }

        res.status(200).json({ user })
    }
    static async editUser(req, res) {

        const id = req.params.id

        const { username, email,  password, confirmpassword } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado!'
            })
            return
        }

        if (req.file) {
            user.image = req.file.filename
        }
        
        if (!username) {
            res.status(422).json({ message: 'O username é Obrigatório' })
        }

        user.username = username

        if (!email) {
            res.status(422).json({ message: 'O email é Obrigatório' })
            return
        }

        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({
                message: 'Por favor ultilize outro e-mail!'
            })
            return
        }

        user.email = email

        if (password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não são iguais!' })
            return
        } else if (password === confirmpassword && password != null) {

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id }, //Update by id
                { $set: user }, //Param for data 
                { new: true } //Param update 
            )

            res.status(200).json({ message: 'Usuário atualizado!' })

        } catch (err) {
            res.status(500).json({ message: err })
            return
        }
    }
}