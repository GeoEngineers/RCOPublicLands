#!/bin/bash
# A simple script to process Washington State Public Lands Inventory data for use with TileMill

# Export WDF Acquisitions from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_acq_wdfw.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_acq_wdfw WHERE gid > 0'
echo "Exported WDFW Acquisitions "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_acq_wdfw_gen_10.shp $HOME/downloads/wa_pli_acq_wdfw.shp -simplify 10
echo "Simplified WDFW Acquisitions"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_acq_wdfw_gen_10.zip $HOME/downloads/wa_pli_acq_wdfw_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_acq_wdfw_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped WDFW Acquisitions to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_acq_wdfw.*
sudo rm $HOME/downloads/zip wa_pli_acq_wdfw_gen_10.*
sudo rm $HOME/downloads/wa_pli_acq_wdfw_gen.*
echo "Temporary Files Removed"


# Export Parks Acquisitions from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_acq_parks.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_acq_parks WHERE gid > 0'
echo "Exported Parks Acquisitions "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_acq_parks_gen_10.shp $HOME/downloads/wa_pli_acq_parks.shp -simplify 10
echo "Simplified Parks Acquisitions"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_acq_parks_gen_10.zip $HOME/downloads/wa_pli_acq_parks_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_acq_parks_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Parks Acquisitions to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_acq_parks.*
sudo rm $HOME/downloads/zip wa_pli_acq_parks_gen_10.*
sudo rm $HOME/downloads/wa_pli_acq_parks_gen.*
echo "Temporary Files Removed"


# Export DNR Acquisitions from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_acq_dnr.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_acq_dnr WHERE gid > 0'
echo "Exported DNR Acquisitions "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_acq_dnr_gen_10.shp $HOME/downloads/wa_pli_acq_dnr.shp -simplify 10
echo "Simplified DNR Acquisitions"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_acq_dnr_gen_10.zip $HOME/downloads/wa_pli_acq_dnr_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_acq_dnr_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped DNR Acquisitions to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_acq_dnr.*
sudo rm $HOME/downloads/zip wa_pli_acq_dnr_gen_10.*
sudo rm $HOME/downloads/wa_pli_acq_dnr_gen.*
echo "Temporary Files Removed"

echo "Moving onto Principal Landuses"

# Export Conservation Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_conservation.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_conservation WHERE gid > 0'
echo "Exported Conservation Lands "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_conservation_gen_10.shp $HOME/downloads/wa_pli_conservation.shp -simplify 10
echo "Simplified Conservation Lands"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_conservation_gen_10.zip $HOME/downloads/wa_pli_conservation_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_conservation_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Conservation Lands to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_conservation.*
sudo rm $HOME/downloads/zip wa_pli_conservation_gen_10.*
sudo rm $HOME/downloads/wa_pli_conservation_gen.*
echo "Temporary Files Removed"

# Export Developed Recreation Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_developed_rec.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_developed_recreation WHERE gid > 0'
echo "Exported Developed Recreation Lands "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_developed_rec_gen_10.shp $HOME/downloads/wa_pli_developed_rec.shp -simplify 10
echo "Simplified Conservation Lands"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_developed_rec_gen_10.zip $HOME/downloads/wa_pli_developed_rec_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_developed_rec_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Conservation Lands to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_developed_rec.*
sudo rm $HOME/downloads/zip wa_pli_developed_rec_gen_10.*
sudo rm $HOME/downloads/wa_pli_developed_rec_gen.*
echo "Temporary Files Removed"

# Export Habitat Passive Rec Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_habitat_passive_rec.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_habitat_passive_recreation WHERE gid > 0'
echo "Exported Habitat Passive Rec "
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.shp $HOME/downloads/wa_pli_habitat_passive_rec.shp -simplify 10
echo "Simplified Habitat Passive Rec"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.zip $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Habitat Passive Rec Lands to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec.*
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.*
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec_gen.*
echo "Temporary Files Removed"

# Export Other Landuse Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_otherlanduse.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_otherlanduse WHERE gid > 0'
echo "Exported Other LandUse"
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_otherlanduse_gen_10.shp $HOME/downloads/wa_pli_otherlanduse.shp -simplify 10
echo "Simplified Other Landuse"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_otherlanduse_gen_10.zip $HOME/downloads/wa_pli_otherlanduse_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_otherlanduse_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Other Landuse to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec.*
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec_gen_10.*
sudo rm $HOME/downloads/wa_pli_habitat_passive_rec_gen.*
echo "Temporary Files Removed"

# Export Revenue from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_revenue.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_revenue WHERE gid > 0'
echo "Exported Revenue"
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_revenue_gen_10.shp $HOME/downloads/wa_pli_revenue.shp -simplify 10
echo "Simplified Revenue Lands"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_revenue_gen_10.zip $HOME/downloads/wa_pli_revenue_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_revenue_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Other Landuse to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_revenue.*
sudo rm $HOME/downloads/wa_pli_revenue_gen_10.*
sudo rm $HOME/downloads/wa_pli_revenue_gen.*
echo "Temporary Files Removed"

# Export Unknown Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_unknown.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_rco_publiclands_unknown WHERE gid > 0'
echo "Exported Unknown Lands"
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_unknown_gen_10.shp $HOME/downloads/wa_pli_unknown.shp -simplify 10
echo "Simplified Unknown Lands"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_unknown_gen_10.zip $HOME/downloads/wa_pli_unknown_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_unknown_gen_10.zip s3://wapubliclandsdata/ --force
echo "Pushed zipped Unknown Lands to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_unknown.*
sudo rm $HOME/downloads/wa_pli_unknown_gen_10.*
sudo rm $HOME/downloads/wa_pli_unknown_gen.*
echo "Temporary Files Removed"


# Export FULL PARCEL set Lands from Postgres
sudo pgsql2shp -f $HOME/downloads/wa_pli_all.shp -h localhost -p 5432 -u postgres -P P%ssword37 rco_publiclands 'SELECT gid, geom, taxid, acqyear, prov1, landuse, landuses, owntype, acres, unitname, owner, pland, acqcost, provide_type as provtype, aquatic FROM vw_big_dataset WHERE gid > 0'
echo "Exported Unknown Lands"
# Simplify the data by 10 meters
sudo ogr2ogr $HOME/downloads/wa_pli_all_gen_10.shp $HOME/downloads/wa_pli_all.shp -simplify 10
echo "Simplified Unknown Lands"
# compress the data into a zip
sudo zip $HOME/downloads/wa_pli_all_gen_10.zip $HOME/downloads/wa_pli_all_gen_10.*
# Send the data to an Amazon S3 Bucket
sudo s3cmd put $HOME/downloads/wa_pli_all_gen_10.zip s3://publiclandsdata/ --force
echo "Pushed zipped Unknown Lands to S3"
# Clean up temp files
sudo rm $HOME/downloads/wa_pli_all.*
sudo rm $HOME/downloads/wa_pli_all_gen_10.*
sudo rm $HOME/downloads/wa_pli_all_gen.*
echo "Temporary Files Removed"



s3cmd setacl --acl-public --recursive s3://wapubliclandsdata/*
