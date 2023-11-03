const prisma = require('../prisma/prisma-client');

const createEmployee = async (req, res) => {
    try {
        const {firstName, lastName, age, address} = req.body;
        const user = req.user;
        console.log(user.id, firstName, lastName, age, address);

        if (!firstName || !lastName || !age || !address){
            return res.status(400).json({message: "Заполните все необходимые поля!"})
        }

        const registeredEmployee = await prisma.employee.findFirst({
            where: {
                firstName,
                lastName,
                age,
                address,
            }
        })

        if (registeredEmployee){
            return res.status(400).json({message: "Данный сотрудник уже существует!"})
        }

        // Вариант создания пользователя через модель юзера.
        // await prisma.user.update({
        //     where: {
        //         id: user.id
        //     },
        //     data : {
        //         createdEmployee: {
        //             create: {
        //                 firstName, 
        //                 lastName, 
        //                 age, 
        //                 address
        //             }
        //         }
        //     },
        // })

        // Вариант создания пользователя через его модель.
        const employee = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                age,
                address,
                userId: user.id
            }
        })

        if (employee){
            return res.status(201).json(employee);
        }
        else{
            return res.status(400).json({message: "Не удалось создать сотрудника!"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        }) 
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany()
       
        res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        }) 
    }
}

const getOneEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id
        
        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId
            }
        })

        if (!employee){
            return res.status(400).json({
                message: "Не удалось получить сотрудника."
            })
        }

        res.status(200).json(employee)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        }) 
    }
}

const editEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const {firstName, lastName, age, address} = req.body;
        
        if (!firstName || !lastName || !age || !address){
            return res.status(400).json({message: "Заполните все необходимые поля!"})
        }

        const updatedEmployee = await prisma.employee.update({
            where: {
                id: employeeId,
            },
            data:{
                firstName,
                lastName,
                age,
                address
            }
        })

        if (updatedEmployee){
            return res.status(204).json(updatedEmployee);
        }
        else{
            return res.status(400).json({message: "Не удалось создать сотрудника!"})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        }) 
    }
}

const removeEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id
        console.log(employeeId);
        const employee = await prisma.employee.delete({
            where: {
                id: employeeId
            }
        })

        if (!employee){
            return res.status(400).json({
                message: "Не удалось удалить сотрудника."
            })
        }

        res.status(200).json(employee)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так..."
        }) 
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getOneEmployee,
    editEmployee,
    removeEmployee,
}