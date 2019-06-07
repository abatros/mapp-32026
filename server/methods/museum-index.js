import {db, package_id, _assert } from '../cms-api.js';

Meteor.methods({
  'museum-index': ()=>{
    const etime = new Date().getTime()
    return db.query (`
      select
        item_id as id,
        data->>'sec' as sec,
        data->>'h1' as h1,
        data->'h2' as h2,
        data->>'ci' as ci,
        data->>'yp' as yp,
        data->>'pic' as pic,
        data->'mk' as mk,
        data->>'fr' as fr,
        data->>'en' as en,
        data->>'cn' as cn,
        data->>'yc' as yc,
        data->'indexNames' as indexNames,
        data->>'flag' as flag
      from cms_articles__directory
      where package_id = $(package_id)
      order by yp, h1;
    `, {package_id})
    .then(data =>{
      const _etime = new Date().getTime() - etime;
      console.log(`cms_articles__directory => ${data.length} in ${_etime} ms.`)
      return Promise.resolve({
        _etime: _etime,
        rows: data
      })
    })
  }
});
