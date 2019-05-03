import db from '../../config/sequelize_master';
import httpStatus from 'http-status';
import _ from 'lodash';
import help from '../helpers/Helper';

const op = db.Sequelize.Op;
const Notifikasi = db.Notification;
const UserDetail = db.UserDetail;
const Company = db.Company;
const EmpInfo = db.EmployeeInfo;


/*
 * Create notifications to user (without companyId)
 * @returns {notifications}
 */
async function sendToUser(req, sender, user) {
	let receiver = user;

	/* mapping & preparing notifications data */
	function mapper(data) {
		return data.map( (obj) => {
			return {
				sender_id: sender.id,
				sender_name: sender.name,
				sender_logo: sender.logo,
				receiver_id: obj,
				title: req.body.title,
				messages: req.body.messages,
				status: "unread",
			}
		})
	}

	let penerima = await mapper(receiver);
	Notifikasi.bulkCreate(penerima).then().catch(e => e)

	return penerima;
}

/*
 * Create notifications to all user in one company 
 * @returns {notifications}
 */
async function sendToAllUser(req, sender, company) {
	let receiver = company,
		filter = {
			where: {
				company: receiver,
				employee: { [op.ne]: null},
				status: 1,
			},
		};

	/* mapping & preparing notifications data */
	function mapper(data) {
		return data.map( (obj) => {
			return {
				sender_id: sender.id,
				sender_name: sender.name,
				sender_logo: sender.logo,
				receiver_id: _.get(obj, 'user_id'),
				title: req.body.title,
				messages: req.body.messages,
				status: "unread",
			}
		})
	}

	let list_penerima = UserDetail.findAll(filter),
		penerima = await mapper(list_penerima);
	Notifikasi.bulkCreate(penerima).then().catch(e => e);

	return list_penerima;
}

/*
 * Find name of sender by user_id
 * @return {name}
 */
async function findSender(req) {
	let company_id = req.user.company, 
		user_id = req.user.id, 
		roles = req.user.roles,
		sender = {
			id: req.user.id,
		};

	if(roles === "superadmin") {
		sender.name = 'FaceOffice Corporate'
        sender.logo = 'http://corporate.faceoffice.co.id/img/assets/login-ic.png'

        return sender;
	}
	else if(roles === "admin") {
		let company = await Company.findById(company_id, {
			attributes: ['name', 'logo', 'mini_logo']
		});

		sender.name = `${_.get(company, 'name', null)}`
        sender.logo = _.get(company, 'logo') ? help.getHostFile(req) + _.get(company, 'logo') : null

		return sender;
	}
	else {
		let employee = await Employee.findById(user_id, {
			attributes: ['employee_id'],
            include: [
                {model: EmpInfo, as: 'info', attributes: ['name']}
            ]
		})

		sender.name = `${_.get(employee, 'info.name', null)}`
        sender.logo = _.get(employee, 'info.photo') ? help.getHostFile(req) + _.get(employee, 'info.photo') : null

		return sender;
	}
}

export default {sendToUser, sendToAllUser, findSender};