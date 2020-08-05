const { Router } = require('express');
const TenantController = require('../controllers/tenant');
const checkAuth = require('../middleware/check_auth');

const router = Router();

router.get('/', TenantController.getAll);

module.exports = router;
