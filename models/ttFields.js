var ttFields = {
  gcpMstr: {
    table: 'gcp_mstr',
    pk: 'gcp_id',
    fields: [
      'gcp_id',
      'gcp_name',
      'gcp_city',
      'gcp_area',
      'gcp_supervisor_secretary',
      'gcp_admin_president',
      'gcp_state',
      'reason_for_creation',
      'created_date',
      'created_by',
      'last_updated_by',
      'last_updated_date',
    ]
  }
};

module.exports = ttFields;
