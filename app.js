// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm6MTj3LV2jcRP7DlDCKCw4xr2CFUs5D0",
    authDomain: "visuara-55dde.firebaseapp.com",
    projectId: "visuara-55dde",
    storageBucket: "visuara-55dde.appspot.com",
    messagingSenderId: "498231883101",
    appId: "1:498231883101:web:7936a0e0aa0cb04499a4b4",
    measurementId: "G-WM5LYNJ7QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.email === 'admin@example.com') { // Replace with your admin email
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('admin-container').style.display = 'block';
            } else {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('client-container').style.display = 'block';
                loadClientPhotos(user.uid);
            }
        })
        .catch((error) => {
            document.getElementById('login-error').style.display = 'block';
        });
});

// File upload functionality
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const clientId = document.getElementById('client-id').value;
    const files = document.getElementById('photo-upload').files;
    const storageRef = ref(storage);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileRef = ref(storageRef, `${clientId}/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', function(snapshot) {
        }, function(error) {
            console.log('Error uploading file:', error);
        }, function() {
            document.getElementById('upload-success').style.display = 'block';
        });
    }
});

// Load client photos functionality
function loadClientPhotos(clientId) {
    const storageRef = ref(storage, clientId);
    listAll(storageRef).then(function(result) {
        result.items.forEach(function(photoRef) {
            getDownloadURL(photoRef).then(function(url) {
                const img = document.createElement('img');
                img.src = url;
                document.getElementById('photos-list').appendChild(img);
            });
        });
    }).catch(function(error) {
        console.log('Error loading photos:', error);
    });
}
