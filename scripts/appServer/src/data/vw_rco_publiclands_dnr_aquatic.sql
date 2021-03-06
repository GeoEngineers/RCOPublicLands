-- View: vw_rco_publiclands_dnr_aquatic
DROP VIEW IF EXISTS vw_rco_publiclands_dnr_aquatic CASCADE;

CREATE OR REPLACE VIEW vw_rco_publiclands_dnr_aquatic AS 
 SELECT vw_big_dataset.gid, vw_big_dataset.geom, vw_big_dataset.prov1 AS dataproviderid, vw_big_dataset.owner, vw_big_dataset.acqyear AS acquisition_year, vw_big_dataset.owntype AS owner_type, vw_big_dataset.acres, vw_big_dataset.pland AS primary_landuse, vw_big_dataset.acqcost AS acquisition_cost
   FROM vw_big_dataset
    WHERE vw_big_dataset.aquatic = 1;

    ALTER TABLE vw_rco_publiclands_dnr_aquatic
      OWNER TO postgres;


