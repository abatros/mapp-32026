import {db, package_id, _assert } from '../cms-api.js';


Meteor.methods({
  'pdf-pages-count': async ()=>{
    const retv1 = await db.query(`
      select count(*)
      from txt
      join acs_objects o on (o.object_id = txt.object_id)
      where o.package_id = $1
    ;`, [package_id], {single:true});

//    console.log(`found ${retv1.count} pages retv1:`,retv1)
//    pdf_pages_count= retv1.count; // set(retv1[0].count)

    const retv2 = await db.query(`
      select count(*)
      from cms_pdf__directory
      where package_id = $1 -- 236393;
    ;`, [package_id], {single:true});
//    console.log(`found ${retv2.count} pdf/files retv2:`,retv2)

//    console.log(`method pdf-page-count =>${pdf_pages_Count}`)
    return {
      pdf_count: retv2.count,
      pdf_pages_count: retv1.count
    };
  }
});
