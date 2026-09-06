window.addEventListener('layoutLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');

    menu.addEventListener('toggle', (event) => {
        hamburger.setAttribute('aria-expanded', event.newState === 'open' ? 'true' : 'false');
    });
});