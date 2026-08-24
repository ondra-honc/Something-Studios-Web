async function loadTemplate() 
{
    try
    {
        const file = await fetch('layout.html');
        const response = await response.text();

        const parser = new DOMParser();
        const layoutDoc = parser.parseFromString(htmlString, 'text/html');

        const headerTemplate = layoutDoc.querySelector<HTMLTemplateElement>('#header');
        const footerTemplate = layoutDoc.querySelector<HTMLTemplateElement>('#footer');

        if (headerTemplate)
        {
           const headerContainer = document.getElementById('site-header');
            headerContainer?.replaceWith(headerTemplate.content.cloneNode(true));
        }

        if (footerTemplate)
        {
            const footerContainer = document.getElementsById('site-footer');
            footerContainer?.replaceWith(footerTemplate.content.cloneNode(true));
        }
    } catch (error)
    {
        console.error('Failed to load layout templates:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadLayout);