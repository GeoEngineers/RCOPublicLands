-- View: vw_rco_publiclands_acq_dnr

DROP VIEW IF EXISTS vw_rco_publiclands_acq_dnr CASCADE;

CREATE OR REPLACE VIEW vw_rco_publiclands_acq_dnr AS 
 SELECT vw_big_dataset.gid, vw_big_dataset.geom, vw_big_dataset.prov1 AS dataproviderid, vw_big_dataset.owner, vw_big_dataset.acqyear AS acquisition_year, vw_big_dataset.owntype AS owner_type, vw_big_dataset.acres, vw_big_dataset.pland AS primary_landuse, vw_big_dataset.acqcost AS acquisition_cost
   FROM vw_big_dataset
    WHERE vw_big_dataset.prov1 = 640 AND vw_big_dataset.acqyear >= 2004;

    ALTER TABLE vw_rco_publiclands_acq_dnr
      OWNER TO postgres;


