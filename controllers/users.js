const prisma = require('../prisma/prisma-client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {
        const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json('Пожалуйста, заполните обязательные поля.')
    }

    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    })

    const isPasswordCorrect = user && (await bcrypt.compare(password, user.password))
    
    if (isPasswordCorrect && user){
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            token: jwt.sign({id: user.id}, secret, {expiresIn: '30d'})
        })
    }
    else{
        return res.status(400).json({message: 'Неверно введен логин или пароль'})
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        })   
    }
}


const register = async (req, res) => {
    try {
        const {email, password, name} = req.body;
    if (!email || !password || !name){
        return res.status(400).json('Пожалуйста, заполните обязательные поля')
    };

    const registeredUser = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (registeredUser){
        return res.status(400).json('Пользователь с таким имейлом уже зарегистрирован')
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: passwordHash
        }
    });

    if(user && secret){
        res.status(201).json({
            id: user.id,
            email: user.email,
            name,
            token: jwt.sign({id: user.id}, secret, {expiresIn: '30d'})
        }) 
    }
    else{
        return res.status(400).json('Не удалось создать пользователя')
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        })   
    }
}

const current = (req, res) => {
    res.status(200).json(req.user);
}

module.exports = {
    login,
    register,
    current
}