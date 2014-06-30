-- View: vw_big_dataset

DROP VIEW vw_big_dataset CASCADE;

CREATE OR REPLACE VIEW vw_big_dataset AS 
 SELECT publiclands_final.gid, publiclands_final.geom, publiclands_final.polyid::text AS taxid, publiclands_final.acquisit_1 AS acqyear, publiclands_final.dataprov_1 AS prov1, publiclands_final.dataprovid AS provide_type, 
        CASE
                      WHEN "position"(publiclands_final.landuses::text, ','::text) > 0 THEN "substring"(publiclands_final.landuses::text, 0, "position"(publiclands_final.landuses::text, ','::text))
                                    ELSE ''::text
                                              END AS landuse, publiclands_final.landuses, publiclands_final.dnraquatic AS aquatic, 
                                                      CASE
                                                                    WHEN publiclands_final.ownershipt = 0 THEN 'Unknown'::text
                                                                                  WHEN publiclands_final.ownershipt = 1 THEN 'Fee Simple'::text
                                                                                                ELSE ''::text
                                                                                                          END AS owntype, round(publiclands_final.gisacres::numeric, 2) AS acres, upper(
                                                                                                                  CASE
                                                                                                                              WHEN "position"(publiclands_final.generaldes::text, '</GeneralDescription>'::text) > 0 THEN 
                                                                                                                                            CASE
                                                                                                                                                              WHEN regexp_replace(regexp_replace(regexp_replace(regexp_replace(xpath('./ParkName/text()'::text, XMLPARSE(DOCUMENT regexp_replace(regexp_replace(publiclands_final.generaldes::text, '</OWNERCLASSIFICATIO'::text, '</OWNERCLASSIFICATION>'::text), 'R&PP'::text, 'RPP'::text) STRIP WHITESPACE))::text, '{"'::text, ''::text), '"}'::text, ''::text), '{'::text, ''::text), '}'::text, ''::text) = ''::text THEN 
                                                                                                                                                                                CASE
                                                                                                                                                                                                      WHEN regexp_replace(regexp_replace(regexp_replace(regexp_replace(xpath('./Location/text()'::text, XMLPARSE(DOCUMENT regexp_replace(regexp_replace(publiclands_final.generaldes::text, '</OWNERCLASSIFICATIO'::text, '</OWNERCLASSIFICATION>'::text), 'R&PP'::text, 'RPP'::text) STRIP WHITESPACE))::text, '{"'::text, ''::text), '"}'::text, ''::text), '{'::text, ''::text), '}'::text, ''::text) = ''::text THEN ''::text
                                                                                                                                                                                                                            ELSE regexp_replace(regexp_replace(regexp_replace(regexp_replace(xpath('./Location/text()'::text, XMLPARSE(DOCUMENT regexp_replace(regexp_replace(publiclands_final.generaldes::text, '</OWNERCLASSIFICATIO'::text, '</OWNERCLASSIFICATION>'::text), 'R&PP'::text, 'RPP'::text) STRIP WHITESPACE))::text, '{"'::text, ''::text), '"}'::text, ''::text), '{'::text, ''::text), '}'::text, ''::text)
                                                                                                                                                                                                                                              END
                                                                                                                                                                                                                                                              ELSE regexp_replace(regexp_replace(regexp_replace(regexp_replace(xpath('./ParkName/text()'::text, XMLPARSE(DOCUMENT regexp_replace(regexp_replace(publiclands_final.generaldes::text, '</OWNERCLASSIFICATIO'::text, '</OWNERCLASSIFICATION>'::text), 'R&PP'::text, 'RPP'::text) STRIP WHITESPACE))::text, '{"'::text, ''::text), '"}'::text, ''::text), '{'::text, ''::text), '}'::text, ''::text)
                                                                                                                                                                                                                                                                            END
                                                                                                                                                                                                                                                                                        ELSE ''::text
                                                                                                                                                                                                                                                                                                  END) AS unitname, publiclands_final.ownername AS owner, 
                                                                                                                                                                                                                                                                                                        CASE
                                                                                                                                                                                                                                                                                                                      WHEN publiclands_final.primarylan = 0 THEN 'Unknown'::text
                                                                                                                                                                                                                                                                                                                                    WHEN publiclands_final.primarylan = 1 THEN 'Fee Simple'::text
                                                                                                                                                                                                                                                                                                                                                  WHEN publiclands_final.ownertype = 2 THEN 'Conservation Easement (i.e. Riparian Open Space)'::text
                                                                                                                                                                                                                                                                                                                                                                WHEN publiclands_final.ownertype = 3 THEN 'Right-of-Way'::text
                                                                                                                                                                                                                                                                                                                                                                              WHEN publiclands_final.ownertype = 4 THEN 'Other Easement (i.e. Forest Riparian Easement)'::text
                                                                                                                                                                                                                                                                                                                                                                                            WHEN publiclands_final.ownertype = 5 THEN 'Sold'::text
                                                                                                                                                                                                                                                                                                                                                                                                          WHEN publiclands_final.ownertype = 6 THEN 'Proposed Future Acquisition'::text
                                                                                                                                                                                                                                                                                                                                                                                                                        ELSE ''::text
                                                                                                                                                                                                                                                                                                                                                                                                                                  END AS pland, publiclands_final.acquisit_2 AS acqcost
                                                                                                                                                                                                                                                                                                                                                                                                                                     FROM publiclands_final
                                                                                                                                                                                                                                                                                                                                                                                                                                      ORDER BY publiclands_final.ownername;

                                                                                                                                                                                                                                                                                                                                                                                                                                      ALTER TABLE vw_big_dataset
                                                                                                                                                                                                                                                                                                                                                                                                                                        OWNER TO postgres;

