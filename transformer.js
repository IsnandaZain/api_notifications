import _ from 'lodash';
import moment from 'moment';

function transformAll(notification) {
	return {
		id: _.get(notification, 'id'),
		sender: _.get(notification, 'sender_name'),
		sender_logo: _.get(notification, 'sender_logo'),
		receiver: _.get(notification, 'receiver_id'),
		title: _.get(notification, 'title'),
		messages: _.get(notification, 'messages').slice(0,31),
		status: _.get(notification, 'status'),
		created: _.get(notification, 'created_at'),
	};
}

function transformCollection(notifications) {
	return _.map(notifications, notification => { return transformAll(notification) });
}

export default {transformAll, transformCollection};