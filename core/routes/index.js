const express = require('express');
const router = express.Router();
const { commonController, sequencesController } = require('../controllers')

router.get('/version', commonController.version)
router.get('/health', commonController.health)
router.get('/metrics', commonController.metrics)
router.get('/api-export', commonController.openApi)

router.post('/', sequencesController.execute)

module.exports = router