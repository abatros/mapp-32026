import R from 'ramda';
const nspell = require('../nspell-vdico.js')

import {db, package_id, _assert } from '../cms-api.js';

function deep_search(query) {
  const {db, package_id} = openacs;
  return db.pdf__search_rank_cd3(query, package_id)
}



async function search_v1(query) {
  const {db, package_id} = openacs;
  const vdico = nspell.vdico();
  //console.log(`nspell.vdico:`,vdico);

  query = query.replace(/"/g,' ')
  const audit = [];

    // check if there is logical operators in the query, if so execute.
  if (query.match(/[<>\&\|]/)) {
    let etime = new Date().getTime();
    //const pages = await db.pdf__search_rank_cd3(query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q1:(${etime} ms.) ${pages.length} results for: ${query}`)
    audit.push(`q1: (${etime} ms.) ${pages.length} results for: ${query}`)
    return {etime, audit, pages}
  }
  // --- here, we don't have logic.

  const vq = query.split(' ');

  // try the phraseto_tsquery
  if (true) {
    const _query = vq.join('<->');
    let etime = new Date().getTime();
//    const pages = await db.pdf__search_rank_cd3(_query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q20:(${etime} ms.) ${pages.length} results for: ${_query}`)
    audit.push(`q20: (${etime} ms.) ${pages.length} results for: ${_query}`)
    if (pages.length > 0) {
      return {etime, audit, pages}
    }
  }

  if (true) { // try suggestions same length ()<->()<->()
    const _query = vq.map(w => {
      if (w.length > 2)
        w =vdico[0].suggest(w).filter(it=>(it.length == w.length)).concat([w]).join(' | ')
      return `(${w})`;
    }).join('<->')
    let etime = new Date().getTime();
//    const pages = await db.pdf__search_rank_cd3(_query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q21:(${etime} ms.) ${pages.length} results for: ${_query}`)
    audit.push(`q21: (${etime} ms.) ${pages.length} results for: ${_query}`)
    if (pages.length > 0) {
      return {etime, audit, pages}
    }
  }

  if (true) { // try suggestions same length ()<->()<->()
    const _query = vq.map(w => {
      if (w.length > 2)
        w =vdico[0].suggest(w)
              .filter(it=>((it.length <= w.length+1)&&(it.length >= w.length-1)))
              .concat([w]).join(' | ')
      return `(${w})`;
    }).join('<->')
    let etime = new Date().getTime();
    //const pages = await db.pdf__search_rank_cd3(_query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q22:(${etime} ms.) ${pages.length} results for: ${_query}`)
    audit.push(`q22: (${etime} ms.) ${pages.length} results for: ${_query}`)
    if (pages.length > 0) {
      return {etime, audit, pages}
    }
  }

  // in & and | mode, ignore 1,2 letters words.
  const vq3 = vq.filter(it => (it.length>2));

  if (true) { // try the AND
    const _query = vq3.join(' & ');
    let etime = new Date().getTime();
    //const pages = await db.pdf__search_rank_cd3(_query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q30:(${etime} ms.) ${pages.length} results for: ${_query}`)
    audit.push(`q30: (${etime} ms.) ${pages.length} results for: ${_query}`)
    if (pages.length > 0) {
      return {etime, audit, pages}
    }
  }

  if (true) { // try the AND
    const _query = vq3.join(' | ');
    let etime = new Date().getTime();
    //const pages = await db.pdf__search_rank_cd3(_query, package_id)
    const pages = await deep_search(_query)
    etime = new Date().getTime() - etime;
    console.log(`q40:(${etime} ms.) ${pages.length} results for: ${_query}`)
    audit.push(`q40: (${etime} ms.) ${pages.length} results for: ${_query}`)
//    if (data.length > 0) {
      return {etime, audit, pages}
//    }
  }
}

Meteor.methods({
  'deep-search': async (query) =>{
    const retv = await search_v1(query);
    //console.log(`deep-search.pages:`,retv.pages)
    return retv;
  }
})
