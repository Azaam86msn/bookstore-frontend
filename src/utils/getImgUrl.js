// frontend/src/utils/getImgUrl.js
function getImgUrl(name) {
    // If the name starts with "http" assume it's a complete URL from the backend.
    if (name && (name.startsWith('http://') || name.startsWith('https://'))) {
      return name;
    }
    // Otherwise, return the static asset URL.
    const url = new URL(`../assets/books/${name}`, import.meta.url);
    return url.href;
  }
  
  export { getImgUrl };
  