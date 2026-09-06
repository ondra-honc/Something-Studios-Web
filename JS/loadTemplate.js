async function loadTemplate() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const isGitHub = window.location.hostname.endsWith('github.io');
    const basePrefix = (isGitHub && pathSegments.length > 0) ? `/${pathSegments[0]}` : '';
    const notFoundUrl = `${basePrefix}/404.html`;
    const onErrorPage = window.location.pathname.endsWith('/404.html');

    const fail = (reason) => {
        console.error('Failed to load layout templates:', reason);
        if (!onErrorPage) {
            window.location.replace(notFoundUrl);
        }
    };

    try {
        const response = await fetch(`${basePrefix}/layout.html`);
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

        const headerContainer = document.getElementById('site-header');
        const footerContainer = document.getElementById('site-footer');

        const headerReady = Boolean(headerTemplate && headerContainer);
        const footerReady = Boolean(footerTemplate && footerContainer);

        if (headerReady && footerReady) {
            headerContainer.replaceWith(processFragment(headerTemplate));
            footerContainer.replaceWith(processFragment(footerTemplate));
            window.dispatchEvent(new CustomEvent('layoutLoaded'));
        } else {
            fail(`incomplete layout (header: ${headerReady}, footer: ${footerReady})`);
        }
    } catch (error) {
        fail(error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTemplate);
} else {
    loadTemplate();
}