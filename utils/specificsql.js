//jshint esversion:6
var dbcpool = require('../config/dbcpool');
var mysql = require('mysql');

exports.getUserRole = function(uid, done) {
  dbcpool.query(`SELECT rm.role_id FROM roles_mstr AS rm, roles_transaction AS rt,
    tt_user_mstr AS um where rm.ROLE_ID=rt.ROLE_ID AND um.user_id=rt.user_id and
    um.user_id=?`, JSON.stringify(uid), function(err, result) {
      if (error) throw error;
      done(err, result);
    });
  };

  exports.getAllEnrollmentHighlight = function(fieldOfficers, done) {

    var sqlQuery = `SELECT FRM.farmer_id, s.status_name, FRM.file_path, FRM.created_date,
    FRM.frm_name, FRM.last_name, FRM.city_twn_village, GROUP_CONCAT(DISTINCT CONCAT(GMS.gcp_name)
    SEPARATOR ',') AS gcps FROM FARMER_MSTR FRM JOIN FIELD_MSTR FLM ON
    FLM.farmer_id = FRM.farmer_id AND FRM.status_id = 4 AND FLM.officer_id in (?) INNER JOIN GCP_MAPPING GMP
    ON GMP.field_id = FLM.field_id JOIN status s on s.status_id = FRM.status_id INNER JOIN GCP_MSTR GMS ON GMS.gcp_id = GMP.gcp_id
    GROUP BY FRM.farmer_id, FRM.file_path, FRM.created_date, FRM.frm_name, FRM.city_twn_village;`;
    dbcpool.query(sqlQuery, [fieldOfficers],

      function(err, result) {
        if (err) throw err;
        console.log('results : ', result);
        done(err, result);
      });
    };

    function getSearchEnrolledFarmers(fieldOfficers, query, done) {
      var containsQuery = '%' + query + '%';
      var sqlQuery = `SELECT FRM.farmer_id, FRM.file_path, FRM.created_date,
      FRM.frm_name, FRM.city_twn_village, GROUP_CONCAT(DISTINCT CONCAT(GMS.gcp_name)
      SEPARATOR ',') AS gcps FROM FARMER_MSTR FRM JOIN FIELD_MSTR FLM ON
      FLM.farmer_id = FRM.farmer_id AND FRM.status_id = 4 AND FLM.officer_id in (?) INNER JOIN GCP_MAPPING GMP
      ON GMP.field_id = FLM.field_id INNER JOIN GCP_MSTR GMS ON GMS.gcp_id = GMP.gcp_id
      WHERE FRM.frm_name LIKE ? GROUP BY FRM.farmer_id, FRM.file_path, FRM.created_date,
      FRM.frm_name, FRM.city_twn_village;`

      dbcpool.query(sqlQuery, [fieldOfficers, containsQuery],
        function(err, result) {
          if (err) throw err;
          done(err, result);
        });
      }

      function getFieldAndOtherMappingDetails(farmer_id, done) {
        var sqlQuery = `SELECT FM.*, SM.*, PM.*,
        GROUP_CONCAT(DISTINCT CONCAT(CM.crop_id) SEPARATOR ',') as crops
        FROM FIELD_MSTR FM
        JOIN snm_mapping SM using(field_id)
        JOIN ppm_mapping PM using(field_id)
        JOIN crop_to_field_mapping CM using(field_id)
        WHERE FM.farmer_id = ?
        GROUP BY FM.field_id;`

        dbcpool.query(sqlQuery, farmer_id,
          function(err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
              var croparray = result[i].crops;
              if (croparray !== null) {
                var crops = croparray.split(',').map(value => ({
                  "crop_id": value
                }));
                result[i].crops = crops;
              }
            }
            done(err, result);
          });
        }

        function csvJSON(csv) {

          var lines = csv.split("\n");
          var result = [];
          var headers = lines[0].split(",");
          for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
            }
            result.push(obj);
          }
          return JSON.stringify(result); //JSON
        }

        exports.getFieldAndOtherMappingDetails = getFieldAndOtherMappingDetails;
        exports.getSearchEnrolledFarmers = getSearchEnrolledFarmers;
