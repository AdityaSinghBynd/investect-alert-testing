export function getFaviconUrl(url: string, size: number = 64): string {
    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  
    try {
      const parsedUrl = new URL(normalizedUrl);
      const domain = parsedUrl.hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
    } catch (error) {
      console.error("Invalid URL:", url);
      return "";
    }
  }

export function getCleanDomainName(url: string): string {
    try {
        const normalizedUrl = url.startsWith("http://") || url.startsWith("https://")
            ? url
            : `https://${url}`;
        const parsedUrl = new URL(normalizedUrl);
        // Remove TLD and get the main domain name
        const domainParts = parsedUrl.hostname.split('.');
        // Get the domain name without www. prefix and without TLD
        let cleanDomain = domainParts[0] === 'www' ? domainParts[1] : domainParts[0];
        // Capitalize first letter
        return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
    } catch (error) {
        console.error("Invalid URL:", url);
        return "";
    }
}