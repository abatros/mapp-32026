import { Meteor } from 'meteor/meteor';
const yaml = require('js-yaml');
const fs = require('fs');
const massive = require('massive');
const monitor = require('pg-monitor');
const hash = require('object-hash');

//export const cms = {};
export var db;
export var package_id;
export var app_folder_id;

Meteor.startup(() => {
  // code to run on server at startup
  console.log(`cms-api.js::Meteor.startup.`)
  //console.log(`Environment variables: `, process.env)
  //console.log(`Meteor.settings:`,Meteor.settings)
  //cms.status = 'opening';

  const cmd = Object.assign(Meteor.settings,{verbose:0});
  cmd.password = cmd.password || process.env.PGPASSWORD;
  if (!cmd.password) throw 'fatal_@22 Missing password';
  open_cms(cmd)
  .then(retv =>{
//    console.log('open-cms => status:',retv.status)
//    Object.assign(cms,retv);
    //console.log(`open-cms app_folder:`,cms.app_folder)
    console.log(`Leaving Meteor.startup with:
      db: ${!!db}
      package_id: ${package_id}
      `)
  })
  .catch(err => {
    console.log(`FATAL-ERROR trying to open-cms
      `,err)
    //console.log(cmd);
  })
});


// ----------------------------------------------------------------------------

/*
    - connect to postgres database
    - find app-instance => package_id
    - find app-folder => app_folder
*/


async function open_cms(cmd) {

  _assert(cmd.password, cmd, 'fatal-@37 Missing password');
  db = await massive(cmd);
  if (cmd.pg_monitor) {
    monitor.attach(db.driverConfig);
    console.log(`pg-monitor attached-Ok.`);
  }
  //cmd.db = db
  openacs.db = db;
//return 'ok';


  await select_app_instance('museum-monday-291')
  .then(retv =>{
    console.log(`select_app_instance('museum-monday-291')=>`,retv);
    Object.assign(openacs, {
      package_id: retv.package_id,
      app_folder: retv.folder_id
    })
  });

  await select_app_folders('museum-monday-291')
  .then(retv =>{
    console.log(`select_app_folders('museum-monday-291')=>`,retv);
  });

  await authors_directory();
  return 'ok';
}

// ----------------------------------------------------------------------------

async function authors_directory() {
  _assert(db, db, 'fatal-@71');
  _assert(package_id,package_id,'fatal-@79')
  const directory = await db.query(`
    select * from cms_authors__directory a
    where package_id = $1
  `,[package_id], {single:false}
  );
  console.log(`authors_directory length:`, directory.length)
}

// ----------------------------------------------------------------------------

export function _assert(b, o, err_message) {
  if (!b) {
    console.log(`######[${err_message}]_ASSERT=>`,o);
    console.trace(`######[${err_message}]_ASSERT`);
    throw 'FATAL: '+err_message; // {message} to be compatible with other exceptions.
  }
}

/*
exports = {
//  db,
  package_id,
//  app_folder,
  app_folder_id,
  _assert
}
*/

// -------------------------------------------------------------------------

const select_app_instance = async function (instance_name) {
  const db = openacs.db;
  if (!db) throw 'get_app_instance::DB-NOT-READY@64'

  const museum_instances = `
    select f.folder_id, i.parent_id, i.name, f.label, f.package_id, p.instance_name
    from cr_folders f
    join apm_packages p on (p.package_id = f.package_id)
    join cr_items i on (i.item_id = f.folder_id)

    --  join acs_objects o on (o.object_id = f.folder_id)

    where ((p.package_key = 'cms') or (p.package_key = 'museum'))
    and parent_id = -100
    and instance_name = $1
  `;

  return db.query(museum_instances,[instance_name], {single:false})
  .then(apps =>{
    if (apps.length != 1) {
      throw 'App-instance not unique'
    }
    package_id = apps[0].package_id
    _assert(package_id, apps, 'UNABLE to get app')
    console.log(`select_app_instance(${instance_name} =>`,apps[0])
    return apps[0]
  })
  .catch(err =>{
    throw err;
  })
}

// ---------------------------------------------------------------------------

const select_app_folders = async function(instance_name) {
  const db = openacs.db;
  const app_folders = `
    select f.folder_id,
      i.parent_id, i.name, i.content_type,
      f.label, f.package_id, p.instance_name
    from cr_folders f
    join apm_packages p on (p.package_id = f.package_id)
    join cr_items i on (i.item_id = f.folder_id)

    --  join acs_objects o on (o.object_id = f.folder_id)

    where ((p.package_key = 'cms') or (p.package_key = 'museum'))
--    and parent_id = -100
    and instance_name = $1
  `;

  const folders = await db.query(app_folders,
    [instance_name], {single:false})
//  console.log('folders:', folders)
  folders.forEach(folder=>{
    switch(folder.name) {
      case 'publishers': pfolder_id = folder.folder_id; break;
      case 'auteurs': afolder_id = folder.folder_id; break;
      default: root_folder_id = folder.folder_id;
    }
  })
  return folders;
}
