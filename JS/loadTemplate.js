async function loadTemplate() {
    try {
        const response = await fetch('./layout.html');
        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const layoutDoc = parser.parseFromString(htmlText, 'text/html');

        const headerTemplate = layoutDoc.querySelector('#header');
        const footerTemplate = layoutDoc.querySelector('#footer');
        
        if (headerTemplate) {
            const headerContainer = document.getElementById('site-header');
            headerContainer?.replaceWith(headerTemplate.content.cloneNode(true));
        }
        
        if (footerTemplate) {
            const footerContainer = document.getElementById('site-footer');
            footerContainer?.replaceWith(footerTemplate.content.cloneNode(true));
            window.dispatchEvent(new CustomEvent('layoutLoaded'));
        }
    } catch (error) {
        console.error('Failed to load layout templates:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTemplate);
} else {
    loadTemplate();
}