var userFields = {

  ttUserMstr: {
    table: 'tt_user_mstr',
    pk: 'user_id',
    fields: [
      'user_id',
      'first_name',
      'middle_name',
      'last_name',
      'addr1',
      'addr2',
      'addr3',
      'city_twn_village',
      'state',
      'pincode',
      'country',
      'mobile',
      'landline',
      'email',
      'created_date',
      'created_by',
      'last_updated_by',
      'last_updated_date',
      'status_id',
      'file_path',
    ]
  },

  rolesTransaction: {
    table: 'roles_transaction',
    pk: 'rl_trs_id',
    fields: [
      'rl_trs_id',
      'user_id',
      'role_id',
      // 'created_date',
      // 'created_by',
      // 'last_updated_by',
      // 'last_updated_date',
    ]
  },
  rolesMstr: {
    table: 'roles_mstr',
    pk: 'role_id',
    fields: [
      'role_id',
      'role_name',
      // 'created_date',
      // 'created_by',
      // 'last_updated_by',
      // 'last_updated_date',
    ]
  },
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

module.exports = userFields;
