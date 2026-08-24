async function loadTemplate() {
    try {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const isGitHub = window.location.hostname.endsWith('github.io');
        const repoPrefix = (isGitHub && pathSegments.length > 0) ? `/${pathSegments[0]}` : '';

        const response = await fetch(`${repoPrefix}/layout.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const htmlText = await response.text();
        const parser = new DOMParser();
        const layoutDoc = parser.parseFromString(htmlText, 'text/html');

        const headerTemplate = layoutDoc.querySelector('#header');
        const footerTemplate = layoutDoc.querySelector('#footer');

        const applyPrefix = (fragment) => {
            if (!repoPrefix) return fragment;
            fragment.querySelectorAll('[href^="/"], [src^="/"]').forEach(el => {
                const attr = el.hasAttribute('href') ? 'href' : 'src';
                el.setAttribute(attr, repoPrefix + el.getAttribute(attr));
            });
            return fragment;
        };

        if (headerTemplate) {
            const content = applyPrefix(headerTemplate.content.cloneNode(true));
            document.getElementById('site-header')?.replaceWith(content);
        }

        if (footerTemplate) {
            const content = applyPrefix(footerTemplate.content.cloneNode(true));
            document.getElementById('site-footer')?.replaceWith(content);
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