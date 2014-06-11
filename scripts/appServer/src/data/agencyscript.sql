Select * from 
(SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'Federal' as agency
  FROM vw_rco_publiclands_federal a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
  Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DNR' as agency
  FROM vw_rco_publiclands_acq_dnr a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10) as Agencies Order by agency, areaname