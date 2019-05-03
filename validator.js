import Joi from 'joi';

export default {
	/** POST /api/v1/notifications/ */
	create: {
		body: {
			title: Joi.string().max(255).required(),
			messages: Joi.string().required(),
		},
	},

	/** FIND Query */
	find: {
		query: {
			page: Joi.number().integer(),
			limit: Joi.number().integer(),
		}
	}
};