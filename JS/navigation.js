window.addEventListener('layoutLoaded', () => {
    const menu = document.getElementById('hamburger');
    const back = document.getElementById('backarrow');

    menu.addEventListener('click', () => {
        toggleMenu();
    })

    back.addEventListener('click', () => {
        toggleMenu();
    })
    
    function toggleMenu() {
        const current = menu.getAttribute('aria-expanded');
        const evaluate = current != 'true' ? 'true': 'false';
        menu.setAttribute('aria-expanded', evaluate);
    }
})
