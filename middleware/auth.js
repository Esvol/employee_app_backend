const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma-client");

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "") || "";

    if (!token) {
      return res.status(400).json("Токен пользователя не найден.");
    }

    const secret = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, secret);

    if (!decoded) {
        return res.status(400).json("Токен не прошел верификацию.");
    }

    const user = await prisma.user.findUnique({
        where: { 
            id: decoded.id
        } 
    }) 

    req.user = user;

    next();
  } catch (error) {
    console.log('Error: \n', error); 
    return res.status(401).json({
        message: "Не авторизован."
    })
}
};

module.exports = {
  auth,
};
