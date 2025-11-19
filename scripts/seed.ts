/**
 * Seed script to populate Firestore with initial organizations
 * Run with: npm run seed
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

const organisations = [
  {
    id: 'org_beta_dublin',
    name: 'Beta',
    type: 'PRIMARY',
    primaryContactEmail: 'info@beta.ie',
    primaryContactPhone: '(01) 555 1234',
    active: true,
    country: 'IE',
    coverageZones: [
      {
        type: 'CIRCLE',
        centerLat: 53.3498,
        centerLng: -6.2603,
        radiusKm: 15,
      },
    ],
    coverageCenterLat: 53.3498,
    coverageCenterLng: -6.2603,
  },
  {
    id: 'org_pmvtrust',
    name: 'Peter McVerry Trust',
    type: 'SECONDARY',
    primaryContactEmail: 'info@pmvtrust.ie',
    primaryContactPhone: '(01) 823 0776',
    active: true,
    country: 'IE',
    coverageZones: [
      {
        type: 'CIRCLE',
        centerLat: 53.3498,
        centerLng: -6.2603,
        radiusKm: 15,
      },
    ],
    coverageCenterLat: 53.3498,
    coverageCenterLng: -6.2603,
  },
  {
    id: 'org_dublin_north_outreach',
    name: 'Dublin North Outreach',
    type: 'OUTREACH',
    primaryContactEmail: 'contact@dublinnorthoutreach.ie',
    primaryContactPhone: '(01) 555 2345',
    active: true,
    country: 'IE',
    coverageZones: [
      {
        type: 'CIRCLE',
        centerLat: 53.3807,
        centerLng: -6.2543,
        radiusKm: 10,
      },
    ],
    coverageCenterLat: 53.3807,
    coverageCenterLng: -6.2543,
  },
  {
    id: 'org_dublin_south_outreach',
    name: 'Dublin South Outreach',
    type: 'OUTREACH',
    primaryContactEmail: 'contact@dublinsouthoutreach.ie',
    primaryContactPhone: '(01) 555 3456',
    active: true,
    country: 'IE',
    coverageZones: [
      {
        type: 'CIRCLE',
        centerLat: 53.3189,
        centerLng: -6.2603,
        radiusKm: 10,
      },
    ],
    coverageCenterLat: 53.3189,
    coverageCenterLng: -6.2603,
  },
  {
    id: 'org_cork_city_street_team',
    name: 'Cork City Street Team',
    type: 'PRIMARY',
    primaryContactEmail: 'info@corkstreetteam.ie',
    primaryContactPhone: '(021) 555 4567',
    active: true,
    country: 'IE',
    coverageZones: [
      {
        type: 'CIRCLE',
        centerLat: 51.8969,
        centerLng: -8.4863,
        radiusKm: 12,
      },
    ],
    coverageCenterLat: 51.8969,
    coverageCenterLng: -8.4863,
  },
];

async function seedOrganisations() {
  console.log('🌱 Starting organization seed...\n');

  for (const org of organisations) {
    try {
      await db.collection('organisations').doc(org.id).set({
        ...org,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✓ Created organization: ${org.name} (${org.id})`);
    } catch (error) {
      console.error(`✗ Failed to create ${org.name}:`, error);
    }
  }

  console.log('\n✅ Organization seed completed!\n');
}

async function createAdminUser() {
  console.log('👤 Creating admin user...\n');

  const adminEmail = 'admin@streetcheck.ie';
  const adminPassword = 'StreetCheck2024!'; // Change this in production!

  try {
    // Create user
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'System Admin',
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'ADMIN',
    });

    // Create user document
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: adminEmail,
      name: 'System Admin',
      role: 'ADMIN',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✓ Admin user created successfully!`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  UID: ${userRecord.uid}\n`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`ℹ Admin user already exists\n`);
    } else {
      console.error(`✗ Failed to create admin user:`, error);
    }
  }
}

async function createResponderUser() {
  console.log('👤 Creating responder user...\n');

  const responderEmail = 'responder@beta.ie';
  const responderPassword = 'Responder2024!'; // Change this in production!

  try {
    // Create user
    const userRecord = await admin.auth().createUser({
      email: responderEmail,
      password: responderPassword,
      displayName: 'Beta Responder',
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'RESPONDER',
      organisationId: 'org_beta_dublin',
    });

    // Create user document
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: responderEmail,
      name: 'Beta Responder',
      role: 'RESPONDER',
      organisationId: 'org_beta_dublin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✓ Responder user created successfully!`);
    console.log(`  Email: ${responderEmail}`);
    console.log(`  Password: ${responderPassword}`);
    console.log(`  Organization: Beta (org_beta_dublin)`);
    console.log(`  UID: ${userRecord.uid}\n`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`ℹ Responder user already exists\n`);
    } else {
      console.error(`✗ Failed to create responder user:`, error);
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('StreetCheck Database Seed Script');
  console.log('='.repeat(60));
  console.log();

  try {
    await seedOrganisations();
    await createAdminUser();
    await createResponderUser();

    console.log('='.repeat(60));
    console.log('✅ All seed operations completed successfully!');
    console.log('='.repeat(60));
    console.log();
    console.log('IMPORTANT: Change default passwords before deploying to production!');
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
