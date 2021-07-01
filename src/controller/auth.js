const { user } = require('../../models')
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body
        const data = req.body

        const schema = joi.object({
            fullname: joi.string().min(3).required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).required()
        })

        const { error } = schema.validate(data)

        if (error) {
            return res.send({
                status: 'failed',
                message: error.details[0].message
            })
        }

        const checkEmail = await user.findOne({
            where: {
                email
            }
        })

        if (checkEmail) {
            return res.send({
                status: 'failed',
                message: 'Email Already Registered'
            })
        }
        const hashStrenght = 10
        const hashedPassword = await bcrypt.hash(password, hashStrenght)

        const dataUser = await user.create({
            ...data,
            password: hashedPassword
        })

        res.send({
            status: 'success',
            data: {
                user: {
                    fullname: dataUser.fullname,
                    email: dataUser.email
                }
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

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body
        const data = req.body

        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(8).required()
        })

        const { error } = schema.validate(data)

        if (error) {
            return res.send({
                status: 'failed',
                message: error.details[0].message
            })
        }

        const checkEmail = await user.findOne({
            where: {
                email
            }
        })

        if (!checkEmail) {
            return res.send({
                status: 'failed',
                message: 'Email or Password dont match'
            })
        }

        const isValidPassword = await bcrypt.compare(password, checkEmail.password)

        if (!isValidPassword) {
            return res.send({
                status: 'failed',
                massage: 'Email or Password dont match'
            })
        }

        const secretKey = process.env.SECRET_KEY

        const token = jwt.sign({
            id: checkEmail.id
        }, secretKey)

        res.send({
            status: 'success',
            data: {
                user: {
                    fullname: checkEmail.fullname,
                    email: checkEmail.email,
                    token
                }
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