<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// 1. Collez ici votre objet firebaseConfig que vous avez copié depuis la console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0uemLSZLySrTkDjSw669r3zoPUvlDVxc",
  authDomain: "dbs-web-9440b.firebaseapp.com",
  projectId: "dbs-web-9440b",
  storageBucket: "dbs-web-9440b.firebasestorage.app",
  messagingSenderId: "594832545821",
  appId: "1:594832545821:web:bd4c3bea14aea0652b8ef4",
  measurementId: "G-FQNLC3EHSQ",
};

// 2. Initialisez l'application Firebase
const app = initializeApp(firebaseConfig);

// 3. Obtenez une instance de Firestore
const firestore = getFirestore(app);

// 4. Fonction pour récupérer et afficher les données
const afficherEtudiants = async () => {
  const tableBody = document.getElementById("data-body");
  tableBody.innerHTML = ""; // Effacer le contenu précédent

  try {
    // 5. Créez une référence à la collection 'etudiants'
    const etudiantsCollection = collection(firestore, "etudiants");

    // 6. Récupérez tous les documents de la collection
    const querySnapshot = await getDocs(etudiantsCollection);

    // 7. Parcourez les documents et affichez les données dans le tableau
    querySnapshot.forEach((doc) => {
      console.log("Document ID:", doc);
      const data = doc.data();
      const nom = data.nom;
      const filier = data.filier;
      const moyenne = data.moyenne;

      const row = `
  <tr class="odd:bg-white even:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span class="math-inline">${nom}</td\>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${filier}</td>
<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${moyenne}</td>
</tr>
`;
      tableBody.innerHTML += row;
    });
  } catch (error) {   
    console.error(
      "Erreur lors de la récupération des données Firestore:",
      error
    );
    tableBody.innerHTML =
      '<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Erreur lors du chargement des données.</td></tr>';
  }
};
// 8. Appelez la fonction pour afficher les étudiants lorsque la page se charge
window.onload = afficherEtudiants;
</script>


