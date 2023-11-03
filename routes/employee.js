const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const { getAllEmployees, createEmployee, getOneEmployee, removeEmployee, editEmployee } = require('../controllers/employees');

/* api/employees */
router.get('/', auth, getAllEmployees);

/* api/employees/:id */
router.get('/:id', auth, getOneEmployee);

/* api/employees/add */
router.post('/add', auth, createEmployee);

/* api/employees/edit/:id */
router.put('/edit/:id', auth, editEmployee);

/* api/employees/remove/:id */
router.delete('/remove/:id', auth, removeEmployee);

module.exports = router;