var fieldInspection = {
  table: 'field_inspection',
  pk: 'field_insp_id',
  fk: '',
  fields: [
    'field_insp_id',
    'ref_points',
    'contamination_details',
    'storage_details',
    'storage_remarks',
    'natural_habitat_id',
    'natural_habitat_structure',
    'natural_habitat_remark',
    'erosion_control_id',
    'erosion_control_structure',
    'erosion_control_remark',
    'natural_process_id',
    'natural_process_remark',
    'mech_process_id',
    'mech_process_structure',
    'compliance_previous_condition',
    'compliance_this_inspection',
    'natural_processing',
    'mechanical_processing',
    'animanl_husbandary',
    'begin_date_conversation',
    'last_date_conversation',
    'Comments_for_conversion',
    'type_of_border',
    'soil_conservation_comment',
    'water_conservation_comment',
    'natural_habitat_comments',
    'erosion_control_comments',
    'Findings',
    'review_by_admin',
    'status_id',
    'fld_offcr_id',
    'field_id',
    'visit_purpose',
    'soil_fertility_detail',
    'pest_disease_detail',
    'pest_disease_remark',
    'weed_detail',
    'weed_remark',
    'seed_plant_detail',
    'seed_plant_remark',
    'chemical_appl_date',
    'start_time',
    'end_time',
    'soil_con_id',
    'soil_con_structure',
    'soil_con_remark',
    'water_con_id',
    'water_con_structure',
    'water_con_remark',
    'soil_fertility_remark',
    'created_date',
    'created_by',
    'last_updated_by',
    'last_updated_date'
  ]
};
var animalHusbandry = {
  table: 'animal_husbandry',
  pk: 'ah_id',
  fk: '',
  fields: [
    'ah_id',
    'Type_of_animal',
    'num',
    'Breed',
    'Feeds',
    'Medication',
    'field_insp_id',
  ],
  node: 'animalHusbandry'
};
var inspectionAnalysis = {
  table: 'inspection_analysis',
  pk: 'ia_id',
  fk: '',
  fields: [
    'ia_id',
    'farmer_market_linkage',
    'Previous_Sale_Price',
    'Previous_Sale_Date',
    'previous_market_linkage',
    'crop_id',
    'farmer_id',
    'field_insp_id',
  ]
};
var stockDetails = {
  table: 'stock_details',
  pk: 'stock_id',
  fk: '',
  fields: [
    'stock_id',
    'variety_of_crop',
    'Quantity',
    'Status',
    'Harvest_time',
    'remarks',
    'field_id',
    'Crop_id',
    'field_insp_id',
  ],
  node: 'stockDetails'
};
var cropTransc = {
  table: 'crop_transc',
  pk: 'trans_id',
  fk: '',
  fields: [
    'trans_id',
    'quantity',
    'status',
    'harvest_time',
    'comments',
    'Previous_Harvest_Yield',
    'Estimated_Yield',
    'DoS',
    'DoH',
    'Crop_Age',
    'field_id',
    'crop_id',
    'field_insp_id',
  ],
  node: 'cropTransc'
};
var smiMapping = {
  table: 'smi_mapping',
  pk: 'smi_map_id',
  fk: '',
  fields: [
    'smi_map_id',
    'field_id',
    'smi_id',
    'field_insp_id',
  ]
};

var equiMapping = {
  table: 'equi_mapping',
  pk: 'equi_map_id',
  fk: '',
  fields: [
    'equi_map_id',
    'field_id',
    'equi_id',
    'field_insp_id',
  ]
};


exports.fieldInspection = fieldInspection;
exports.animalHusbandry = animalHusbandry;
exports.inspectionAnalysis = inspectionAnalysis;
exports.stockDetails = stockDetails;
exports.cropTransc = cropTransc;
exports.smiMapping = smiMapping;
exports.equiMapping = equiMapping;
