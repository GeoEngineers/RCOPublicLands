OP VIEW IF EXISTS vw_rco_publiclands_habitat_passive_recreation CASCADE;

CREATE OR REPLACE VIEW vw_rco_publiclands_habitat_passive_recreation AS 
 SELECT vw_big_dataset.gid, vw_big_dataset.geom, vw_big_dataset.prov1, vw_big_dataset.taxid, vw_big_dataset.landuses, vw_big_dataset.owntype, vw_big_dataset.unitname, vw_big_dataset.acqyear, vw_big_dataset.prov1 AS dataproviderid, vw_big_dataset.owner, vw_big_dataset.pland, vw_big_dataset.acqcost, vw_big_dataset.landuse, vw_big_dataset.provide_type, vw_big_dataset.aquatic, vw_big_dataset.acqyear AS acquisition_year, vw_big_dataset.owntype AS owner_type, vw_big_dataset.acres, vw_big_dataset.pland AS primary_landuse, vw_big_dataset.acqcost AS acquisition_cost
   FROM vw_big_dataset
    WHERE vw_big_dataset.landuse ~~ 'Habitat%'::text OR vw_big_dataset.aquatic = 1;

    ALTER TABLE vw_rco_publiclands_habitat_passive_recreation
      OWNER TO postgres;


