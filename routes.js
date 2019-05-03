import express from 'express';
import validate from 'express-validation';
import notificationCtrl from '../controllers/notifications.controller';
import paramValidation from '../validator/notifications.validation';

const router = express.Router();

router.route('/')
	/** POST /api/v1/notifications - Create new notifications */
	.post(validate(paramValidation.create), notificationCtrl.create);

router.route('/list')
	/** GET /api/v1/notifications/list - Get notifications by receiver */
	.get(validate(paramValidation.find), notificationCtrl.list);

router.route('/me')
	/** GET /api/v1/notifications/me - Get unread notifications by receiver */
	.get(notificationCtrl.me)

router.route('/me/:id')
	/** GET /api/v1/notifications/me/:id - Get notifications by receiver */
	.get(notificationCtrl.get)

router.param('id', notificationCtrl.load);

export default router;