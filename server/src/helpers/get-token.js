const getToken = (req) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1] //Create array for string / select array index 1

    return token //token no 'Bearer' in string
}

module.exports = getToken