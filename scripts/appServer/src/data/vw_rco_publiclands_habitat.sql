-- View: vw_rco_publiclands_habitat

DROP VIEW IF EXISTS vw_rco_publiclands_habitat CASCADE;

CREATE OR REPLACE VIEW vw_rco_publiclands_habitat AS 
 SELECT publiclands_master_v2.gid, publiclands_master_v2.geom, publiclands_master_v2.dataprov_1 AS dataproviderid, publiclands_master_v2.dnraquatic, publiclands_master_v2.landuse, publiclands_master_v2.ownername AS owner_name, publiclands_master_v2.acquisitio AS acquisition_date, publiclands_master_v2.ownertype AS owner_type, publiclands_master_v2.gisacres AS acres, publiclands_master_v2.primarylan AS primary_landuse, publiclands_master_v2.acquisit_2 AS acquisition_cost
   FROM publiclands_master_v2
    WHERE publiclands_master_v2.landuse = 2 AND publiclands_master_v2.dnraquatic = 1;

    ALTER TABLE vw_rco_publiclands_habitat
      OWNER TO postgres;


