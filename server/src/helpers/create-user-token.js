const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    //Create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'nossosecret' ) //Need Fix / AuthConfig.json - adm_system

    //Return token
    res.status(200).json({
        message: 'Você está autenticado!',
        token: token,
        userId: user._id
    })

}

module.exports = createUserToken