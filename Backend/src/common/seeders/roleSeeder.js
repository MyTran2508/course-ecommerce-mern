const mongoose = require('mongoose');
const seeder = require('mongoose-seed');
const UserModel = require('../../users/model/userModel');

const roleData = [
    {
        name: 'User',
        description: 'As a customer, users are the one who views, searches for courses, and performs transactions',
    },
    {
        name: "Manager",
        description: "Permission to manage users, courses, view company statistics, and support users"
    },
    {
        name: "Admin",
        description: "ALL PERMISSION"
    }
  ];

  seeder.connect('"mongodb://127.0.0.1:27017/course-ecommerce"', function () {
  seeder.loadModels(['../../users/model/userModel']); // Load your models here
  seeder.clearModels(['Role'], function () {
    seeder.populateModels(roleData, function () {
      seeder.disconnect();
    });
  });
});