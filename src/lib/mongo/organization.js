import client from './index';
import { updateUser } from './users';
import Organization from '@/lib/schemas/organizationSchema';

let organizations;

export async function init() {
  // if (!client.isConnected()) await client.connect(); // client.isConnected is deprecated
  await client.connect();
  organizations = client.db('manus-unitas').collection('organizations');
}

export async function close() {
  if (client) {
    await client.close();
  }
  organizations = null;
}

export async function getOrganizations() {
  await init().catch(console.error);

  const admin = client.db("admin")
  const result = await admin.command({ listDatabases: 1, nameOnly: true })
  const organizations = result.databases.map(db => db.name).filter(db => db !== 'admin' && db !== 'local' && db !== 'config' && db !== 'manus-unitas' && db !== 'sample_mflix')

  // close();

  return organizations;
}

export async function getOrganization(organizationName) {
  await init().catch(console.error);

  const organization = await organizations.findOne({ displayName: organizationName });


  return organization;
}


export async function createOrganization(organization, user) {
  await init().catch(console.error);

  // console.log(organization)
  // console.log(organizations)

  const admin = client.db("admin")
  const result = await admin.command({ listDatabases: 1, nameOnly: true })

  if (result.databases.map(db => db.name).includes(organization)) {
    return "Organization already exists"
  }

  // console.log(organization)

  if (organizations === undefined) {
    return [];
  } else {
    try {
      // await organizations.insertOne(organization);
      const org = new Organization(organization);
      await org.save();
    } catch (error) {
      console.error(error);
    }
  }

  return await Organization.findOne({ displayName: organization.displayName });
}

export async function getRoles(organization) {
  await init().catch(console.error);

  const roles = await client.db('manus-unitas').collection('roles').find().toArray()

  return roles;
}

export async function getRole(organization, roleType) {
  await init().catch(console.error);

  const roles = await client.db('manus-unitas').collection('roles').findOne({ type: roleType }) // TODO: fix roles

  return roles.roles;
}

export async function createRole(organization, role, type) {
  await init().catch(console.error);

  try {
    await client.db(organization).collection('roles').updateOne({ type: type }, { $push: { roles: role } }, { upsert: true });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRole(organization, roleType, roleName) {
  await init().catch(console.error);

  // find entry by roleType and delete roleName from roles array
  try {
    await client.db(organization).collection('roles').updateOne({ type: roleType }, { $pull: { roles: roleName } });
  } catch (error) {
    console.error(error);
  }
}

export async function createType(organization, type) {
  await init().catch(console.error);

  try {
    await client.db(organization).collection('roles').insertOne({ type: type, roles: [] });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteType(organization, type) {
  await init().catch(console.error);

  try {
    await client.db(organization).collection('roles').deleteOne({ type: type });
  }
  catch (error) {
    console.error(error);
  }
}


export async function updateRole(organization, roleType, update) {
  await init().catch(console.error);

  try {
    await client.db(organization).collection('roles').updateOne({ type: roleType }, update);
  }
  catch (error) {
    console.error(error);
  }
}