const firebaseConfig = {
    apiKey: "AIzaSyBU84r_RKYDoUinlBntyFYJAPWvvQD0xZQ",
    authDomain: "appblocker-cee93.firebaseapp.com",
    databaseURL: "https://appblocker-cee93-default-rtdb.firebaseio.com",
    projectId: "appblocker-cee93",
    storageBucket: "appblocker-cee93.firebasestorage.app",
    messagingSenderId: "388944003396",
    appId: "1:388944003396:web:4e8cac1df4f6d68f5e5711",
    measurementId: "G-TGSK8PV5FF"
};

firebase.initializeApp(firebaseConfig);

function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fetch user data from Firebase Auth and Database (if needed)
function fetchUserDataOnLogin() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const name = user.displayName || 'User';
            const email = user.email;
            const joinDate = new Date(user.metadata.creationTime).toLocaleDateString();

            // Display in DOM
            document.getElementById('fullName').textContent = name;
            document.getElementById('userEmail').textContent = email;
            document.getElementById('joinDate').textContent = joinDate;

            // Fetch extra user data from your database if needed
            firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
                const extraData = snapshot.val();
                // Example: If you store a profile object in your database
                if (extraData && extraData.profile) {
                    // Display extra data if you want, e.g.:
                    // document.getElementById('profileField').textContent = extraData.profile.someField;
                }
            });

            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify({ name, email, joinDate }));
        } else {
            document.getElementById('fullName').textContent = 'Guest User';
            document.getElementById('userEmail').textContent = 'Not logged in';
            document.getElementById('joinDate').textContent = 'Not available';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlName = getUrlParameter('name');
    const urlEmail = getUrlParameter('email');
    const urlDate = getUrlParameter('date');

    if (urlName || urlEmail || urlDate) {
        if (urlName) document.getElementById('fullName').textContent = urlName;
        if (urlEmail) document.getElementById('userEmail').textContent = urlEmail;
        if (urlDate) document.getElementById('joinDate').textContent = urlDate;
    } else {
        // Always check Firebase Auth first and fetch user data
        fetchUserDataOnLogin();
    }
});

// Example logout handler (clear localStorage and optionally redirect)
function logout() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('userData');
        // window.location.href = 'login.html'; // Uncomment if you want to redirect
    });
}