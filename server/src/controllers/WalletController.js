const Wallet = require('../models/Wallet')

//Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class WalletController {

    static async create(req, res) {
        const { name, description, storage } = req.body

        if (!name) {
            res.status(422).json({ message: 'O nome da Carteira é obrigatório!' })
            return
        } else if (!description) {
            res.status(422).json({ message: 'A descrição da Carteira é obrigatório!' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        const wallet = new Wallet({
            name,
            description,
            storage,
            user: {
                _id: user._id,
                name: user.username
            }
        })

        try {
            const newWallet = await wallet.save()
            res.status(201).json({
                message: 'Carteira criada com sucesso!',
                newWallet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAllUserWallet(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const wallet = await Wallet.find({ 'user._id': user._id }).sort("-createAt")

        res.status(200).json({ wallet })
    }


    static async getWalletById(req, res) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const wallet = await Wallet.findOne({ _id: id })

        if (!wallet) {
            res.status(404).json({ message: 'Carteira não encontrada!' })
            return
        }

        res.status(200).json({ wallet: wallet })

    }

    static async removeWalletById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const wallet = await Wallet.findOne({ _id: id })

        if (!wallet) {
            res.status(404).json({ message: 'Carteira não encontrada!' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (wallet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        await Wallet.findByIdAndRemove(id)
        res.status(200).json({ message: 'Carteira removida com sucesso!' })

    }

    static async updateWallet(req, res) {
        const id = req.params.id
        const { name, description } = req.body

        const updatedData = {}

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const wallet = await Wallet.findOne({ _id: id })

        if (!wallet) {
            res.status(404).json({ message: 'Carteira não encontrada!' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (wallet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        } else {
            updatedData.name = name
        }

        if (!description) {
            res.status(422).json({ message: 'A descrição é obrigatória!' })
            return
        } else {
            updatedData.description = description
        }

        await Wallet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: 'Carteira atualizada com sucesso!' })
    }

}

