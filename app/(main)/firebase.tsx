import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDbB99UcjibqGCPJ1x0hurQjtJ6tDTTRE0',
    authDomain: 'project-d3a1a.firebaseapp.com',
    projectId: 'project-d3a1a',
    storageBucket: 'project-d3a1a.appspot.com',
    messagingSenderId: '890583530308',
    appId: '1:890583530308:web:21aaeb431b96d4fbf0f511',
    measurementId: 'G-D4R8E8SG80'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
