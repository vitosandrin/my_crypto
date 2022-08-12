const multer = require('multer')
const path = require('path')

// Storage img
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){

        let folder = ""

        if(req.baseUrl.includes('users')){ //If url has 'users', folder is user
            folder = 'users' //Name folder
        } else if (req.baseUrl.includes('pets')){ //If url has 'pets' folder is pet
            folder = 'pets'
        }
        cb(null, `public/images/${folder}`) //Destination img
    },
    filename: function (req, file, cb){ //Save img with updated data
        cb(null, Date.now() + String(Math.floor(Math.random() *1000)) + path.extname(file.originalname)) //Return 2656594532564.jpg 
        //Date.now() - inclui data para nao subscrever arquivos
    }
}) 

const imageUpload = multer({ 
    storage: imageStorage, 
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)) { //Verify if file is png || jpeg
            return cb(new Error('!Por favor, envie apenas jpg ou png!'))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload }