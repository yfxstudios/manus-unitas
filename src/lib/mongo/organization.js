import client from './index';

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

  close();

  return organization;
}


export async function createOrganization(organization, user) {
  await init().catch(console.error);

  // console.log(organization)
  // console.log(organizations)

  const admin = client.db("admin")
  const result = await admin.command({ listDatabases: 1, nameOnly: true })

  if (result.databases.map(db => db.name).includes(organization.databaseName)) {
    return "Organization already exists"
  }

  // console.log(organization)

  if (organizations === undefined) {
    return [];
  } else {
    try {
      await organizations.insertOne(organization);
      await client.db(organization.databaseName).createCollection('events');
      await client.db(organization.databaseName).collection('people').insertOne({
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        admin: true,
        accepted: true
      });
    } catch (error) {
      console.error(error);
    }
  }

  close();
}

export async function addMember(organization, user) {
  await init().catch(console.error);

  try {
    await client.db(organization).collection('people').insertOne({
      first_name: user.first_name,
      last_name: user.last,
      username: user.username,
      email: user.email,
      phone: user.phone,
      admin: false,
      accepted: false,
      declined: false
    });
  } catch (error) {
    console.error(error);
  }

  close();
}