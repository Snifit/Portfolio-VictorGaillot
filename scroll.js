// Convertir le scroll vertical en déplacement horizontal sans faire défiler la page
// Uniquement sur desktop (largeur > 768px)
const wrapper = document.querySelector('.projects-wrapper');
const container = document.querySelector('.projects-container');

// Vérifier si on est sur mobile
const isMobile = window.innerWidth <= 768;

if (wrapper && container && !isMobile) {
    let currentPosition = 0;
    let targetPosition = 0;
    let velocity = 0;
    let isScrolling = false;
    let animationFrameId = null;

    // Calculer les dimensions
    const wrapperWidth = wrapper.scrollWidth;
    const containerWidth = container.clientWidth;
    const maxScroll = Math.max(0, wrapperWidth - containerWidth);

    // Vitesse de défilement (ajustez cette valeur)
    const scrollSpeed = 2;

    // Paramètres pour l'easing - ajustés pour un arrêt plus lent et smooth
    const baseFriction = 0.92; // Friction de base (plus proche de 1 = ralentissement plus lent)
    const minVelocity = 0.01; // Vitesse minimale avant d'arrêter (plus petit = continue plus longtemps)
    const slowDownThreshold = 5; // Seuil de vitesse pour augmenter la friction

    // Fonction pour calculer la friction dynamique (augmente quand la vitesse diminue)
    function getDynamicFriction(vel) {
        const absVel = Math.abs(vel);
        if (absVel < slowDownThreshold) {
            // Augmenter progressivement la friction quand on ralentit
            const progress = absVel / slowDownThreshold;
            return baseFriction + (0.05 * (1 - progress)); // Friction jusqu'à 0.97
        }
        return baseFriction;
    }

    // Fonction pour mettre à jour la position avec easing
    function updatePosition() {
        // Limiter la position cible entre 0 et maxScroll
        targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

        // Calculer la différence
        const diff = targetPosition - currentPosition;

        // Appliquer l'easing avec interpolation plus lente pour un arrêt plus smooth
        if (Math.abs(diff) > 0.05) {
            // Interpolation plus lente (0.05 au lieu de 0.1) pour un mouvement plus doux
            const interpolationSpeed = Math.abs(velocity) < 1 ? 0.03 : 0.06; // Encore plus lent quand on ralentit
            currentPosition += diff * interpolationSpeed;
        } else {
            currentPosition = targetPosition;
        }

        // Appliquer la position avec transition CSS pour plus de fluidité
        wrapper.style.transform = `translateX(-${currentPosition}px)`;

        // Transition plus longue quand on ralentit
        if (Math.abs(velocity) < 2) {
            wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }

    // Fonction d'animation avec momentum et friction progressive
    function animate() {
        if (Math.abs(velocity) > minVelocity) {
            // Appliquer la friction dynamique (augmente quand on ralentit)
            const dynamicFriction = getDynamicFriction(velocity);
            velocity *= dynamicFriction;
            targetPosition += velocity;

            // Limiter la position
            targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

            updatePosition();
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Arrêter l'animation quand la vitesse est trop faible
            velocity = 0;
            isScrolling = false;
            // Transition finale très smooth pour l'arrêt complet
            wrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updatePosition();
        }
    }

    // Intercepter les événements de scroll (molette, trackpad)
    document.addEventListener('wheel', function (e) {
        // Empêcher le scroll vertical par défaut
        e.preventDefault();

        // Convertir le scroll vertical en déplacement horizontal
        const delta = e.deltaY * scrollSpeed;

        // Mettre à jour la position cible
        targetPosition += delta;

        // Ajouter de la vélocité pour l'effet momentum
        velocity += delta * 0.5;

        // Limiter la vélocité maximale
        velocity = Math.max(-20, Math.min(20, velocity));

        // Démarrer l'animation si elle n'est pas déjà en cours
        if (!isScrolling) {
            isScrolling = true;
            animate();
        }

        updatePosition();
    }, { passive: false });

    // Initialiser la position
    updatePosition();
}