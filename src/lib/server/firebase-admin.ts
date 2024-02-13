import { PRIVATE_STATIC_FIREBASE_SERVICE_ACCOUNT } from '$env/static/private';
import admin from 'firebase-admin';

const initialize = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(PRIVATE_STATIC_FIREBASE_SERVICE_ACCOUNT))
        })
    }
}

export async function verifyIdToken(token: string) {
    if (!token || token === 'null' || token === 'undefined') return null;

    try {
        initialize();
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (e) {
        return null;
    }

}

initialize();

export default admin;