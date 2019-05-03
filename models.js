/**
 * notifications models
 * */
'use strict'
import helper from '../helpers/Helper';

module.exports = (sequelize, DataTypes) => {
	const Notification = sequelize.define('Notification', {
		id: {
			type: DataTypes.INTEGER(8),
			primaryKey: true,
			autoIncrement: true
		},
		sender_id: {
			type: DataTypes.INTEGER(8),
		},
		sender_name: {
			type: DataTypes.STRING(255),
		},
		sender_logo: {
			type: DataTypes.STRING(128),
		},
		receiver_id: {
			type: DataTypes.INTEGER(8),
		},
		title: {
			type: DataTypes.STRING(255),
		},
		messages: {
			type: DataTypes.TEXT,
		},
		status: {
			type: DataTypes.ENUM,
			values: ['unread', 'read']
		},
		read_at: {
			type: DataTypes.DATEONLY,
		},
	},{
		tableName: 'cfo_notifications',
		underscored: true,
		freezeTableName: true,
		paranoid: true,
	});

	Notification.associate = (models) => {

	};

	return Notification; 
};