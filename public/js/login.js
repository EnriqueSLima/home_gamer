async function storeToken(token, expiration) {
  const openRequest = window.indexedDB.open('authDB', 1);

  openRequest.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('tokens', { keyPath: 'id' });
    objectStore.createIndex('expiration', 'expiration', { unique: false });
  };

  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction('tokens', 'readwrite');
    const store = tx.objectStore('tokens');
    store.put({ id: 'jwtToken', token, expiration });
    tx.oncomplete = function() {
      console.log('Token stored in IndexedDB');
    };
    tx.onerror = function(error) {
      console.error('Error storing token:', error);
    };
  };

  openRequest.onerror = function(event) {
    console.error('Error opening database:', event.target.error);
  };
}
