import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCVqyxdTiOJZqx4hmi_Cz8fm58ROb_nk8Q",
    authDomain: "tarefasplus-c8843.firebaseapp.com",
    projectId: "tarefasplus-c8843",
    storageBucket: "tarefasplus-c8843.appspot.com",
    messagingSenderId: "683404745671",
    appId: "1:683404745671:web:818bc16fe26048b42557e2"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

