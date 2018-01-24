CREATE VIEW user_view AS SELECT tt_user_mstr.user_id , rgstr_id, email,user_password, resetPasswordToken,resetPasswordExpires FROM tt_user_mstr LEFT JOIN user_rgstr ON tt_user_mstr.user_id = user_rgstr.user_id ;

ALTER TABLE user_rgstr ADD UNIQUE (user_id);

ALTER TABLE tt_user_mstr ADD UNIQUE (email);

ALTER TABLE user_rgstr MODIFY COLUMN user_password CHAR(60);

ALTER TABLE inspection_analysis ADD field_insp_id INT(11), ADD FOREIGN KEY (field_insp_id) REFERENCES field_inspection(field_insp_id);
ALTER TABLE stock_details ADD field_insp_id INT(11), ADD FOREIGN KEY (field_insp_id) REFERENCES field_inspection(field_insp_id);
ALTER TABLE crop_transc ADD field_insp_id INT(11), ADD FOREIGN KEY (field_insp_id) REFERENCES field_inspection(field_insp_id);
ALTER TABLE smi_mapping ADD field_insp_id INT(11), ADD FOREIGN KEY (field_insp_id) REFERENCES field_inspection(field_insp_id);

ALTER TABLE roles_transaction ADD UNIQUE (user_id);

ALTER TABLE tt_user_mstr ADD status_id INT(11), ADD FOREIGN KEY (status_id) REFERENCES status(status_id);

ALTER TABLE animal_husbandry DROP  created_date,DROP Create_by,DROP last_updated_by,DROP last_updated_date;
ALTER TABLE inspection_analysis DROP  created_date,DROP Create_by,DROP last_updated_by,DROP last_updated_date;
ALTER TABLE crop_transc DROP  created_date,DROP Create_by,DROP last_updated_by,DROP last_updated_date;
ALTER TABLE gcp_mapping DROP  created_date,DROP Create_by,DROP last_updated_by,DROP last_updated_date;

ALTER TABLE equi_mapping ADD field_insp_id INT(11), ADD FOREIGN KEY (field_insp_id) REFERENCES field_inspection(field_insp_id);

ALTER TABLE field_mstr ADD conv_reason VARCHAR(255);

ALTER TABLE animal_husbandry ADD status_id INT(11), ADD FOREIGN KEY (status_id) REFERENCES status(status_id);
ALTER TABLE crop_transc ADD status_id INT(11), ADD FOREIGN KEY (status_id) REFERENCES status(status_id);
ALTER TABLE stock_details ADD status_id INT(11), ADD FOREIGN KEY (status_id) REFERENCES status(status_id);

ALTER TABLE tt_user_mstr ADD file_path VARCHAR(255);
ALTER TABLE farmer_mstr ADD file_path VARCHAR(255);
ALTER TABLE field_inspection ADD file_path VARCHAR(255);


ALTER TABLE roles_transaction DROP created_date,DROP created_by,DROP last_updated_by,DROP last_updated_date;
CREATE VIEW active_users AS SELECT A.*,B.rl_trs_id,B.role_id FROM tt_user_mstr A INNER JOIN roles_transaction B ON A.user_id=B.user_id AND A.status_id=2;

CREATE VIEW user_credentials AS SELECT A.status_id,A.user_id ,A.email, B.rgstr_id, B.user_password, B.resetPasswordToken,B.resetPasswordExpires
FROM (tt_user_mstr A LEFT JOIN user_rgstr B ON A.user_id = B.user_id) WHERE A.status_id=2;

CREATE OR REPLACE VIEW active_users AS SELECT A.*,B.rl_trs_id,B.role_id FROM tt_user_mstr A LEFT JOIN roles_transaction B ON A.user_id=B.user_id WHERE A.status_id=2;

DROP TABLE crop_organic;
DROP TABLE crop_chemical_map;

create table CROP_TO_FIELD_MAPPING (cropId int not null primary key AUTO_INCREMENT,
  crop_id int,
  field_id int,
  FOREIGN KEY (crop_id) REFERENCES crop_mstr(crop_id),
  FOREIGN KEY (field_id) REFERENCES field_mstr(field_id));


  ALTER TABLE `tt1`.`field_mstr`
  DROP COLUMN `area_without_RTC`,
  DROP COLUMN `area_with_RTC`,
  DROP COLUMN `organic_land`,
  DROP COLUMN `chemical_land`,
  DROP COLUMN `area_under_organic`,
  CHANGE COLUMN `area_under_chemical` `farming_type` INT NULL DEFAULT NULL ,
  CHANGE COLUMN `conv_reason` `reason_for_change` VARCHAR(255) NULL DEFAULT NULL,
  ADD survey_number VARCHAR(255),
  ADD chemical_application_date VARCHAR(255),
  ADD reference_to_north VARCHAR(255),
  ADD reference_to_south VARCHAR(255),
  ADD reference_to_east VARCHAR(255),
  ADD reference_to_west VARCHAR(255);
  -- ALTER TABLE tt_user_mstr ADD COLUMN user_active TINYINT(1);
