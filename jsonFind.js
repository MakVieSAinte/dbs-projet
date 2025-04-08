<script>
// Variable pour stocker les données des étudiants
let etudiantsData = null;
let dataLoaded = false;

// Attendre que la page soit complètement chargée
document.addEventListener("DOMContentLoaded", function () {
  // Charger et afficher les données des étudiants
  loadStudentData();

  // Attacher l'événement click au bouton de téléchargement
  document
    .getElementById("download-pdf")
    .addEventListener("click", function (e) {
      e.preventDefault(); // Empêcher la navigation

      if (dataLoaded) {
        // Si les données sont déjà chargées, générer le PDF directement
        generatePDF();
      } else {
        // Sinon, afficher un message d'attente et réessayer après chargement
        alert("Veuillez patienter pendant le chargement des données...");

        // Tenter de recharger les données puis générer le PDF
        loadStudentData().then(() => {
          generatePDF();
        });
      }
    });
});

// Fonction pour charger les données étudiantes
function loadStudentData() {
  return new Promise((resolve, reject) => {
    fetch("etudiantsL1.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du fichier JSON");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données JSON chargées avec succès:", data);
        etudiantsData = data;

        // Remplir le tableau avec les données
        populateTable(data);

        dataLoaded = true;
        resolve(data);
      })
      .catch((error) => {
        console.error("Erreur de chargement des données:", error);
        reject(error);
      });
  });
}

// Fonction pour remplir le tableau avec les données
function populateTable(data) {
  const tableBody = document.getElementById("data-body");
  tableBody.innerHTML = ""; // Nettoyer le tableau existant

  data.etudiants.forEach((etudiant) => {
    const row = document.createElement("tr");
    row.className = "odd:bg-white even:bg-gray-50";

    // Cellule nom et prénom
    const nomPrenomCell = document.createElement("td");
    nomPrenomCell.className =
      "p-5 whitespace-nowrap text-sm text-left leading-6 font-medium text-gray-900";
    nomPrenomCell.textContent = `${etudiant.nom} ${etudiant.prenom}`;
    row.appendChild(nomPrenomCell);

    // Cellule filière
    const filiereCell = document.createElement("td");
    filiereCell.className =
      "p-5 whitespace-nowrap text-sm text-left leading-6 font-medium text-gray-900";
    filiereCell.textContent = etudiant.filiere;
    row.appendChild(filiereCell);

    // Cellule moyenne
    const moyenneCell = document.createElement("td");
    moyenneCell.className =
      "p-5 whitespace-nowrap text-sm text-left leading-6 font-medium text-gray-900";
    moyenneCell.textContent = etudiant.moyenne;
    row.appendChild(moyenneCell);

    tableBody.appendChild(row);
  });
}

// Fonction pour générer et télécharger le PDF
function generatePDF() {
  // Créer un conteneur pour le PDF
  const pdfContainer = document.createElement("div");
  pdfContainer.style.width = "100%";
  pdfContainer.style.padding = "20px";
  pdfContainer.style.boxSizing = "border-box";
  pdfContainer.style.backgroundColor = "red";
  pdfContainer.style.position = "absolute";
  pdfContainer.style.top = "0";
  pdfContainer.style.left = "0";
  pdfContainer.style.zIndex = "-1000 !important";

  // Créer l'en-tête du PDF
  const header = document.createElement("div");
  header.style.textAlign = "center";
  header.style.marginBottom = "20px";
  header.style.fontFamily = "Arial, sans-serif";
  header.innerHTML = `
<div style="max-width: 800px; margin: 0 auto;">
  <h1 style="color: #35CC35; font-size: 24px; font-weight: bold; margin-bottom: 5px;">Digital Business School</h1>
  <h2 style="color: #35CC35; font-size: 20px; font-weight: bold; margin-bottom: 10px;">Licence 1, Semestre 2</h2>
  <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Résultats des étudiants - Généré le ${new Date().toLocaleDateString()}</p>
</div>
`;
  pdfContainer.appendChild(header);

  // Créer une copie du tableau pour le PDF
  const tableContainer = document.createElement("div");
  tableContainer.style.maxWidth = "800px";
  tableContainer.style.margin = "0 auto";
  tableContainer.style.overflowX = "auto";

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";
  table.style.fontFamily = "Arial, sans-serif";

  // En-tête du tableau
  const thead = document.createElement("thead");
  thead.innerHTML = `
<tr style="background-color: #f3f4f6;">
  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">NOM (S) ET PRENOM (S)</th>
  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">FILIERE</th>
  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">MOYENNE</th>
</tr>
`;
  table.appendChild(thead);

  // Corps du tableau avec les données
  const tbody = document.createElement("tbody");

  // Vérifier si les données sont disponibles
  if (etudiantsData && etudiantsData.etudiants) {
    etudiantsData.etudiants.forEach((etudiant, index) => {
      const rowBackground = index % 2 === 0 ? "white" : "#f9fafb";
      tbody.innerHTML += `
    <tr style="background-color: ${rowBackground};">
      <td style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">${
        etudiant.nom
      } ${etudiant.prenom}</td>
      <td style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">${
        etudiant.filiere
      }</td>
      <td style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; color: ${
        etudiant.moyenne <= 10 ? "red!important" : "inherit"
      };">${etudiant.moyenne}</td>
    </tr>
  `;
    });
  } else {
    tbody.innerHTML = `
  <tr>
    <td colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Aucune donnée disponible</td>
  </tr>
`;
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
  pdfContainer.appendChild(tableContainer);

  // Ajouter le conteneur au document
  document.body.appendChild(pdfContainer);

  // Afficher un message de chargement
  const loadingMessage = document.createElement("div");
  loadingMessage.textContent = "Génération du PDF en cours...";
  loadingMessage.style.position = "fixed";
  loadingMessage.style.top = "50%";
  loadingMessage.style.left = "50%";
  loadingMessage.style.transform = "translate(-50%, -50%)";
  loadingMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  loadingMessage.style.color = "white";
  loadingMessage.style.padding = "20px";
  loadingMessage.style.borderRadius = "10px";
  loadingMessage.style.zIndex = "1000";
  document.body.appendChild(loadingMessage);

  // Utiliser window.jsPDF
  const { jsPDF } = window.jspdf;

  // Attendre un petit moment pour que tout soit rendu
  setTimeout(() => {
    // Générer le PDF avec html2canvas et jsPDF
    html2canvas(pdfContainer, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Créer un nouveau document PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Dimensions de la page PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Dimensions de l'image (canvas)
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculer le ratio pour que l'image s'adapte à la largeur de la page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      // Ajouter l'image au PDF
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Si le contenu est trop long, ajouter des pages supplémentaires
      if (imgHeight * ratio > pdfHeight - 20) {
        let heightLeft = imgHeight * ratio;
        let position = -pdfHeight + 20; // Position initiale

        while (heightLeft > 0) {
          position = position - pdfHeight + 20;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            position,
            imgWidth * ratio,
            imgHeight * ratio
          );
          heightLeft -= pdfHeight - 20;
        }
      }

      // Télécharger le PDF
      pdf.save("dbs_resultats_licence1_semestre2.pdf");

      // Nettoyer
      pdfContainer.remove();
      loadingMessage.remove();
    });
  }, 800);
}
</script>


