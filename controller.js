import httpStatus from 'http-status';
import model from '../../config/sequelize_master';
import transform from '../transformer/notifications.transformer';
import moment from 'moment';
import _ from 'lodash';
import helper from '../helpers/notifications';
import APIError from '../helpers/APIError';

const Notifikasi = model.Notification;
const Op = model.Sequelize.Op;
const UserDetail = model.UserDetail;

/**
 * Create new notifications
 * @returns {Notifications}
 */
async function create(req, res, next) {
	let	user = req.body.user_id ? (req.body.user_id.split(',') ? req.body.user_id.split(',') : req.body.user_id) : null,
		company = req.body.company_id ? req.body.company_id : null,
		dataSender = await helper.findSender(req);
		
		if(user !== null) {
			res.json(await helper.sendToUser(req, dataSender, user));
		}
		else if(company !== null) {
			res.json(await helper.sendToAllUser(req, dataSender, company));
		}
		else {
			let sender = req.user.id,
				filter = {
				where: {
					user_id: { [Op.ne]: sender },
				},
			}

			/* mapping & preparing notifications data */
			function mapper(data) {
				return data.map( (obj) => {
					return {
						sender_id: sender,
						sender_name: dataSender.name,
						sender_logo: dataSender.logo,
						receiver_id: _.get(obj, 'user_id'),
						title: req.body.title,
						messages: req.body.messages,
						status: "unread",
					}
				})
			}

			let user_detail = UserDetail.findAll(filter),
				receive_user = await mapper(user_detail);

			Notifikasi.bulkCreate(receive_user).then().catch(e => e);
			res.json(user_detail)
		}
}


/**
 * Load notifications by ID
 * @returns {Notifications}
 */
function load(req, res, next, id) {
	const request_id = req.user.id;
	Notifikasi.findById(id)
		.then( (notif) => {
			if(!notif) {
				const e = new Error ("Notifications doesn't exist")
				e.status = httpStatus.NOT_FOUND
				return next(e)
			}
			else {
				if(notif.receiver_id != request_id) {
					const e = new Error ("You have not permission")
					e.status = httpStatus.UNAUTHORIZED
					return next(e)
				}
				req.notif = notif
				next()
				return null
			}
		})
		.catch(e => next(e))
}


/**
 * Get a notifications
 * @returns {Notifications}
 */
function get(req, res) {
	let notifications = req.notif,
		create = notifications.created_at,
		read = notifications.read_at;
	
	if(read !== null) {
		read = read;
	}
	else {
		read = moment().format('DD-MM-YYYY');
	}

	notifications.update({
		status: "read",
		read_at: read,
		created_at: moment(create).format('DD-MM-YYYY'),
			}).then( data => res.json({
		result: {
			id: data.id,
			sender: data.sender_name,
			sender_logo: data.sender_logo,
			receiver: data.receiver_id, 
			title: data.title,
			messages: data.messages,
			status: data.status,
			create: data.created_at,
		}
	}))
	.catch(e => e);
	
}


const filterBuild = (req) => {
	const receiver = req.user.id;

	let where = {
		receiver_id: receiver,
	}
	let filter = {
		limit: req.query.limit || 5,
		offset: req.query.page ? (req.query.page - 1) * (req.query.limit || 5) : null,
		order: [
			['created_at', 'DESC']
		]
	}

	filter.where = where
	return filter
}

/**
 * Get list notifications
 * @returns {Notifications}
 */
function list(req, res, next) {
	let filter = filterBuild(req);

	Notifikasi.findAndCountAll(filter)
		.then( (notif) => {
			res.json({
				paging: {
					total_pages: Math.ceil(notif.count / filter.limit),
					total_items: notif.count,
					page_number: req.query.page || null,
					limit: filter.limit,
					order: req.query.order ? (req.query.order.includes('-') ? req.query.order.slice(1) : req.query.order) : 'created_at',
					type_order: req.query.order ? (req.query.order.includes('-') ? 'DESC' : 'ASC') : 'DESC',
				},
				result: transform.transformCollection(notif.rows)
			})
		})
		.catch(e => next(e))
}


/**
 * Get unread notifications
 * @returns {Notifications}
 */
function me(req, res, next) {
	const receive = req.user.id;

	Notifikasi.findAll({
		where: {
			receiver_id: receive,
			status: "unread",
		},
		order: [
			['created_at', 'DESC']
		]
	}).then( (unreadNotif) => {
		res.json(transform.transformCollection(unreadNotif));
	})
	.catch(e => next(e));
}

export default {create, get, list, me, load};