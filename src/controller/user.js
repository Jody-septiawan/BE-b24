const { user } = require('../../models')

exports.users = async (req, res) => {
    try {

        const path = process.env.PATH_FILE

        let users = await user.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })

        const parseJSON = JSON.parse(JSON.stringify(users))

        users = parseJSON.map(user => {
            return {
                ...user,
                image: user.image ? path + user.image : null
            }
        })

        res.send({
            status: 'success',
            data: {
                users
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.myProfile = async (req, res) => {
    try {
        const { idUser } = req

        const myData = await user.findOne({
            where: {
                id: idUser
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })

        res.send({
            status: 'success',
            data: {
                myData
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { idUser } = req
        let data = req.body
        const image = req.files.imageFile[0].filename

        data = {
            ...data,
            image
        }

        await user.update(data, {
            where: {
                id: idUser
            }
        })

        res.send({
            status: 'success',
            message: 'Update user data succcess'
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}