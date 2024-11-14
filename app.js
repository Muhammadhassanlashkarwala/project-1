window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 300) {
    navbar.classList.add('fixed-top');
  } else {
    navbar.classList.remove('fixed-top');
  }
});
// loader
setTimeout(function() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none'; // Hide the loader
  document.querySelector('.ld').style.display = 'none'; // Hide the full-screen overlay
}, 5000); // 5000 milliseconds = 5 seconds


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWvgs60p2gxh6qUKWr2OW63udRbkJ79Bc",
  authDomain: "vinauditpro.firebaseapp.com",
  projectId: "vinauditpro",
  storageBucket: "vinauditpro.firebasestorage.app",
  messagingSenderId: "94890464255",
  appId: "1:94890464255:web:cd9a44a688d26f93f54dca",
  measurementId: "G-9CE7NTCS43"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
const db = getFirestore(app);
const auth = getAuth(app);

// **FIRESTORE: Add User Data to Firestore**
async function addUserData(fullName, email, vinNumber,country) {
  try {
    // Add document to "userdata" collection in Firestore
    await addDoc(collection(db, "userdata"), {
      fullName: fullName,
      email: email,
      country:country,
      vinNumber: vinNumber,
      timestamp: new Date() // Add a timestamp for tracking
    });
    console.log("Data added to Firestore!");
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding data to Firestore!");
  }
}

// **FORM HANDLER: Submit Form to Firebase and Web3Forms**
const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent default form submission behavior
  
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  result.innerHTML = "Please wait...";

  // First send data to Web3Forms API
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: json
  })
  .then(async (response) => {
    let jsonResponse = await response.json();
    
    if (response.status === 200) {
      result.innerHTML = "Form submitted successfully";
      location.href = "price.html";

      
      // Extract values from the form data
      const fullName = document.getElementById("full-name").value;
      const email = document.getElementById("email").value;
      const vinNumber = document.getElementById("vin-number").value;
      const country=document.getElementById("country").value

      // Add user data to Firestore
      await addUserData(fullName, email, vinNumber,country);
      
    } else {
      result.innerHTML = jsonResponse.message;
    }
  })
  .catch(error => {
    console.error(error);
    result.innerHTML = "Something went wrong!";
  })
  .finally(() => {
    location.href("price.html")
    // Reset form and hide result message after a delay
    form.reset();
    setTimeout(() => {
      result.style.display = "none";
    }, 3000);
  });
});


