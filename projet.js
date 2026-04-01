// =========================================================
// 1. LES DONNÉES DES PROJETS
// =========================================================
const projectsData = {
    'jeu': {
        title: "Jeu Vidéo ELENA",
        domains: "Godot • Design • Photoshop • JavaScript • Sound Design • Premiere Pro",
        tagline: "Projet personnel - Plateformer 2D contemplatif",
        description: `
            <p>Le jeu vidéo est un moyen puissant pour transmettre des émotions et raconter une histoire.
            Avec le jeu ELENA, j'ai voulu créer une expérience interactive sur mesure :
            un jeu vidéo conçu spécialement pour ma copine, pensé comme un cadeau unique qui mêle un univers
            visuel et des messages personnels.</p>

            <p>Le principal défi résidait dans la direction artistique et l'immersion.
            Je voulais créer une atmosphère agréable et contemplative.
            J'ai donc construit un univers sonore et visuel cohérent,
            capable de lui donner vie sans rompre la fluidité du gameplay.</p>

            <p>C’est un projet complet où j’ai endossé plusieurs casquettes et piloté toute la chaîne de production :
            le développement et l'intégration sur le moteur Godot, la
            conception visuelle sur Photoshop, le Sound Design, et le montage sur Premiere Pro.</p>
        `,
        videoEmbed: '<iframe src="https://files.catbox.moe/opdaaw.mp4" frameborder="0" allow="fullscreen" allowfullscreen></iframe>',
        gallery: [
            'img/projets/4.png', 'img/projets/5.png', 'img/projets/9.png',
            'img/projets/6.png', 'img/projets/7.png', 'img/projets/8.png'
        ]
    },
    'karaflow': {
        title: "KaraFlow Studio PWA",
        domains: "Web Audio API • PWA • Photoshop • Waveform Visualization • JavaScript • Responsive Design",
        tagline: "Projet individuel - Création d'une PWA",
        description: `
            <p>Le studio d'enregistrement professionnel semble souvent inaccessible,
            réservé à ceux qui possèdent du matériel coûteux. Avec KaraFlow,
            j'ai voulu briser cette barrière en concevant une Progressive Web App (PWA) capable de transformer n'importe quel navigateur en un véritable studio de poche.</p>

            <p>Le véritable défi était le mixage asynchrone capable de fusionner une voix et une instrumentale avec une compensation de latence ultra-précise, transformant une simple page HTML en un outil de production musicale organique et fluide.</p>

            <p>C’est un projet complet où j’ai piloté toute la chaîne de production : le développement de la logique audio (Web Audio API), l’intégration d’APIs externes pour l’aide à l’écriture (paroles et rimes), ainsi que la gestion du fonctionnement hors-ligne via un Service Worker.</p>

            <p>Ce travail m’a permis de progresser considérablement sur la manipulation d'API et d'optimiser mon workflow de développeur pour créer des expériences web aussi performantes que des applications natives.</p>
            
            <div class="action-buttons" style="margin-top: 40px; margin-bottom: 20px;">
                <a href="https://srv-peda2.iut-acy.univ-smb.fr/gaillotv/pwa/" target="_blank" class="pill-button">Visiter le site</a>
                <a href="https://github.com/Snifit/KaraFlow" target="_blank" class="pill-button outline">Voir le code GitHub</a>
            </div>
        `,
    },
    'twitch': {
        title: "Transition Twitch",
        domains: "Animation • After Effects • Communauté • Social",
        tagline: "Projet personnel - Découverte d'After Effects",
        description: `
        <p>L'identité visuelle d'une chaîne Twitch est primordiale pour capter et immerger son audience. Avec ce projet,
          j'ai voulu créer une transition de scène sur mesure, en misant sur un style graphique liquide,
          organique et hypnotique, conçu pour se démarquer des transitions géométriques très classiques que l'on voit
          souvent.</p>

        <p>La matière bleue devait couvrir l'intégralité de l'écran à un instant T
          précis pour masquer la coupe entre deux scènes sur OBS, assurant ainsi une fluidité parfaite pour les
          spectateurs.</p>

        <p>C’est un projet de composition visuelle où j’ai pu découvrir After Effects :
          manipulation d'effets de déformation temporelle et spatiale, gestion des calques de forme,
          animation précise des courbes de vitesse,
          et maîtrise de l'exportation vidéo avec un fond transparent optimisée pour les logiciels de streaming.</p>
        `,
        videoEmbed: '<iframe src="https://files.catbox.moe/yvisk6.mp4" frameborder="0" allow="fullscreen" allowfullscreen></iframe>',
    }
};

// =========================================================
// 2. SÉLECTION DES ÉLÉMENTS HTML
// =========================================================
const modalOverlay = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-dynamic-content');
const closeBtn = modalOverlay.querySelector('.modal-close-btn');
const projectLinks = document.querySelectorAll('.project-link');
const body = document.body;

// =========================================================
// 3. FONCTIONS DE GESTION
// =========================================================

// Fonction pour ouvrir la modale et la remplir (Version Intelligente)
function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return; // Si le projet n'existe pas, on arrête

    // A. Gérer la Galerie
    let galleryHtml = '';
    if (data.gallery && data.gallery.length > 0) {
        galleryHtml = '<div class="modal-project-gallery">';
        data.gallery.forEach(imgSrc => {
            galleryHtml += `<img src="${imgSrc}" alt="${data.title}">`;
        });
        galleryHtml += '</div>';
    }

    // B. Gérer la Vidéo
    let videoHtml = '';
    if (data.videoEmbed && data.videoEmbed !== '') {
        videoHtml = `<div class="modal-video-wrapper">${data.videoEmbed}</div>`;
    }

    // C. Construire le contenu global
    const contentHtml = `
        <div class="modal-project-header">
            <h1 class="modal-project-title">${data.title}</h1>
            <p class="modal-project-domains">${data.domains}</p>
        </div>
        <div class="modal-project-description">
            <h2>${data.tagline}</h2>
            ${data.description}
        </div>
        ${videoHtml}
        ${galleryHtml}
    `;

   // D. Injecter le contenu
    modalContent.innerHTML = contentHtml;

    // E. Afficher la modale avec un petit timeout pour que la transition CSS se déclenche
    modalOverlay.style.display = 'block'; // On l'affiche dans le flux
    
    setTimeout(() => {
        modalOverlay.classList.add('open');
        body.classList.add('modal-open');
    }, 10); // 10ms suffisent pour réveiller le navigateur

    // Historique pour le bouton retour
    window.history.pushState({ modalOpen: true }, "", "#" + projectId);
}

function closeProjectModal(fromPopState = false) {
    modalOverlay.classList.remove('open');
    body.classList.remove('modal-open');

    if (!fromPopState) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    // On attend 500ms (la fin de l'anim CSS) avant de cacher complètement le display
    setTimeout(() => {
        if (!modalOverlay.classList.contains('open')) {
            modalOverlay.style.display = 'none';
            modalContent.innerHTML = '';
        }
    }, 500);
}

// =========================================================
// 4. ÉCOUTEURS D'ÉVÉNEMENTS (LES CLICS)
// =========================================================

// Quand on clique sur un projet...
projectLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // C'est CA qui empêche la page de remonter tout en haut !
        openProjectModal(this.getAttribute('data-project'));
    });
});

// Quand on clique sur le bouton fermer
closeBtn.addEventListener('click', () => closeProjectModal(false));

// Quand on clique dans le vide autour de la modale
modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeProjectModal(false);
});

// Quand on utilise le bouton "Retour" du navigateur
window.addEventListener('popstate', function (e) {
    if (modalOverlay.classList.contains('open')) {
        closeProjectModal(true);
    }
});