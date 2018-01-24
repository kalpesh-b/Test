var enrollmentFields = {
  farmer: {
    table: 'farmer_mstr',
    pk: 'farmer_id',
    fk: '',
    fields: [
      'farmer_id',
      'frm_name',
      'frm_husbnd_name',
      'last_name',
      'addr1',
      'addr2',
      'addr3',
      'city_twn_village',
      'state',
      'pincode',
      'country',
      'mobile',
      'email',
      'landline',
      'district'
    ]
  },
  fields: {
    fields: {
      field: {
        table: 'field_mstr',
        pk: 'field_id',
        fk: 'farmer_id',
        fields: [
          'field_id',
          'latitude',
          'longitude',
          'total_area',
          'farming_type',
          'area_proposed_GCP',
          'user_id',
          'farmer_id',
          'reason_for_change',
          'survey_number',
          'chemical_application_date',
          'reference_to_north',
          'reference_to_south',
          'reference_to_east',
          'reference_to_west'
        ]
      },
      crops: {
        pk: 'cropId',
        fk: 'field_id',
        table: 'crop_to_field_mapping',
        fields: ['cropId',
        'crop_id', 'field_id'
      ],
      node: 'crops'
    },
    ppm: {
      pk: 'ppmId',
      fk: 'ppm_id',
      table: 'ppm_mapping',
      fields: ['ppmId', 'ppm_id', 'field_id']
    },
    snm: {
      pk: 'snmId',
      fk: 'snm_id',
      table: 'snm_mapping',
      fields: ['snmId', 'snm_id', 'field_id']
    },
    gcp: {
      pk: 'gcp_trans_id',
      fk: 'gcp_id',
      table: 'gcp_mapping',
      fields: ['gcp_trans_id', 'gcp_id']
    },
  },
  node: 'fields'
}
};

module.exports = enrollmentFields;
