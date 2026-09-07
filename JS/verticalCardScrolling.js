window.addEventListener('layoutLoaded', () => {
    const cardsContainer = document.querySelector('.cards');

    if (cardsContainer) {
        cardsContainer.addEventListener('wheel', (event) => {
            event.preventDefault();

            const card = cardsContainer.querySelector('.news-card');
            if (!card) return;

            const gap = parseFloat(getComputedStyle(cardsContainer).gap) || 0;
            const cardStep = card.offsetWidth + gap;

            cardsContainer.scrollBy({
                left: event.deltaY > 0 ? cardStep : -cardStep,
                behavior: 'smooth'
            });
        }, { passive: false });
    }
})