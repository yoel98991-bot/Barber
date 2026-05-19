// sw.js
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      badge: '/ruta-a-tu-logo.png',
      vibrate: [200, 100, 200, 100, 200],
      data: { url: '/' }
    };

    // 1. Mostramos la notificación del sistema
    const promiseNotificacion = self.registration.showNotification(data.title, options);

    // 2. EXTRA PARA DEPURAR: Enviamos un mensaje a la web abierta
    const promiseMensaje = clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      windowClients.forEach(client => {
        client.postMessage({
          type: 'PUSH_DEBUG',
          mensaje: `Llegó Push: ${data.title}`
        });
      });
    });

    event.waitUntil(Promise.all([promiseNotificacion, promiseMensaje]));
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
