var authFields = {
  userRgstr: {
    table: 'user_rgstr',
    pk: 'rgstr_id',
    fields: [
      'rgstr_id',
      'user_password',
      'resetPasswordToken',
      'resetPasswordExpires',
      'created_date',
      'created_by',
      'last_updated_by',
      'last_updated_date',
      'user_id',
    ]
  }
};

module.exports = authFields;
