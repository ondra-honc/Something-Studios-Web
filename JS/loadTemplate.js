async function loadTemplate() {
    try {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const isGitHub = window.location.hostname.endsWith('github.io');
        const basePrefix = (isGitHub && pathSegments.length > 0) ? `/${pathSegments[0]}` : '';

        const response = await fetch(`${basePrefix}/layout.html`);  

        console.log(`${basePrefix}/layout.html`);

        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const layoutDoc = parser.parseFromString(htmlText, 'text/html');

        const headerTemplate = layoutDoc.querySelector('#header');
        const footerTemplate = layoutDoc.querySelector('#footer');
        
        const processFragment = (template) => {
            const clone = template.content.cloneNode(true);
            if (basePrefix) {
                clone.querySelectorAll('[href^="/"], [src^="/"]').forEach(el => {
                    if (el.hasAttribute('href')) {
                        const href = el.getAttribute('href');
                        if (!href.startsWith(basePrefix)) {
                            el.setAttribute('href', basePrefix + href);
                        }
                    }
                    if (el.hasAttribute('src')) {
                        const src = el.getAttribute('src');
                        if (!src.startsWith(basePrefix)) {
                            el.setAttribute('src', basePrefix + src);
                        }
                    }
                });
            }
            return clone;
        };

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