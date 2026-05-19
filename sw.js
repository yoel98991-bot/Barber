// sw.js
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      // icon: '/ruta-a-tu-logo.png', // Opcional: logo de la app
      badge: '/ruta-a-tu-logo.png',   // Opcional: icono pequeño
      vibrate: [200, 100, 200, 100, 200], // Patrón de vibración
      data: { url: '/' } // Para abrir la web si tocan la notificación
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      if (windowClients.length > 0) {
        windowClients[0].focus();
      } else {
        clients.openWindow(event.notification.data.url);
      }
    })
  );
});
