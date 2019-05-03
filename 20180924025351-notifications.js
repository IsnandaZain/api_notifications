'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

      return queryInterface.bulkCreate('cfo_notifications', [
        {
          sender_id: 153,
          sender_name: "PT Indomarco",
          sende_logo: null,
          receiver_id: 1,
          title: "Meeting Project",
          messages: "Hari ini kumpul diruang meeting jam 12",
          status: "unread",
        }, {
          sender_id: 1,
          sender_name: "Super Admin Corporate",
          sende_logo: null,
          receiver_id: 3,
          title: "Meeting Project",
          messages: "Hari ini kumpul untuk membahas project ABC",
          status: "unread",
        }, {
          sender_id: 1,
          sender_name: "Super Admin Corporate",
          sende_logo: null,
          receiver_id: 5,
          title: "Briefing Anak Magang",
          messages: "Hari ini tolong briefing anak magang",
          status: "read",
        }, {
          sender_id: 154,
          sender_name: "PT ABC Ada 3",
          sende_logo: null,
          receiver_id: 171,
          title: "Briefing Anak Magang",
          messages: "Hari ini tolong briefing anak magang",
          status: "unread",
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
