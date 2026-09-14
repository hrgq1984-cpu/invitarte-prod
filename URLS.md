# Guía Maestra de URLs y Accesos del Sistema
**Plataforma:** TuInvitacionDigital  
**Dominio de Producción:** `https://tuinvitaciondigital.netlify.app`  
**Administrador General:** Horacio Gómez (`hrgq.1984@gmail.com` | `+54 9 3835 438603`)

---

## 📌 Resumen de Rutas y Accesos

| Módulo / Rol | Ruta Relativa | URL en Netlify | Método de Acceso / Credencial |
| :--- | :--- | :--- | :--- |
| **Público / Catálogo** | `/` | `https://tuinvitaciondigital.netlify.app/` | Acceso libre para cualquier visitante o comprador |
| **Administrador General** | `/Maximo1822` | `https://tuinvitaciondigital.netlify.app/Maximo1822` | **Protegido por Clave Maestra:** `Maximo1822` |
| **Portal de Clientes** | `/cliente` | `https://tuinvitaciondigital.netlify.app/cliente` | Correo del titular o código/slug del evento (ej. `sofia-mateo`) |
| **Demo de Celular** | `/invitacion` | `https://tuinvitaciondigital.netlify.app/invitacion` | Acceso directo para probar la tarjeta digital interactiva |
| **Pantalla TV para Salón** | `#tv` o botón TV | `https://tuinvitaciondigital.netlify.app/#tv` | Disponible desde el panel de cliente o URL directa |
| **Invitación de Evento** | `/:slug` | `https://tuinvitaciondigital.netlify.app/sofia-mateo` | Enlace personalizado que el cliente envía a sus invitados |

---

## 1. 🛡️ URL del Administrador General (`/Maximo1822`)

Esta ruta está **estrictamente protegida** con una pantalla de bloqueo (*Admin Login Gate*). Ningún usuario común puede ver las herramientas administrativas sin ingresar la clave maestra.

* **URL Directa:** `https://tuinvitaciondigital.netlify.app/Maximo1822`
* **Ruta local:** `http://localhost:3000/Maximo1822`
* **Clave de Acceso:** `Maximo1822` (también acepta `admin1822`)
* **Funciones Disponibles:**
  1. **Gestión de Precios en Pesos Argentinos (ARS):** Ajustar y actualizar en tiempo real las tarifas de los planes:
     * *Plan Básico*
     * *Plan Plata*
     * *Plan Oro*
  2. **Moderación de Comprobantes y Pagos:**
     * Revisión de comprobantes transferidos vía Mercado Pago / CBU.
     * Botones de acción inmediata: **Aprobar Pago** o **Rechazar**.
  3. **Supervisión y Control de Eventos:**
     * Auditoría de todos los proyectos activos.
     * Monitoreo de mensajes y fotografías enviadas al libro de recuerdos.
     * Posibilidad de eliminar contenido inapropiado antes de que aparezca en pantalla.
  4. **Exportación de Datos:**
     * Descarga de bases de datos de invitados en Excel / JSON.

---

## 2. 👤 URL del Portal de Clientes (`/cliente`)

Espacio privado donde los novios o agasajados gestionan todos los detalles de su evento.

* **URL Directa:** `https://tuinvitaciondigital.netlify.app/cliente`
* **Ruta local:** `http://localhost:3000/cliente`
* **Acceso:** Ingrese el correo con el que se realizó la compra o el identificador del evento (ej: `sofia` o `sofia-mateo`).
* **Funciones Disponibles:**
  1. **Editor del Evento:** Nombres de homenajeados, fecha, cuenta regresiva, dirección de ceremonia y salón con enlace a Google Maps, sugerencia de vestimenta (*Dress Code*).
  2. **Regalos & Datos Bancarios:** CBU, Alias y número de cuenta para aportes de los invitados.
  3. **Generador de Enlaces de WhatsApp:** Personalización de mensajes individuales con el nombre del invitado y su cantidad de pases asignados.
  4. **Gestión de Asistencia (RSVP):** Tabla en tiempo real de invitados confirmados, restricciones alimentarias (celíaco, vegetariano, etc.) y acompañantes.
  5. **Muro de Fotos y Canciones:** Lista de canciones sugeridas por invitados y fotos subidas durante la fiesta.
  6. **Lanzador de Pantalla TV:** Apertura del modo bienvenida a pantalla completa para proyectores del salón.

---

## 3. 🌐 URL Pública / Catálogo Comercial (`/`)

Página de inicio comercial orientada a la conversión y venta.

* **URL Directa:** `https://tuinvitaciondigital.netlify.app/`
* **Ruta local:** `http://localhost:3000/`
* **Acceso:** Libre y público para todo el mundo.
* **Funciones Disponibles:**
  1. Catálogo interactivo de plantillas premium divididas por categorías: *Bodas, 15 Años, Bautismos, Cumpleaños, Infantiles*.
  2. Vista previa en vivo de cada plantilla.
  3. Simulador de celular interactivo para experimentar música de fondo, pétalos/brillos flotantes, cuenta regresiva y botón de agendamiento.
  4. Tabla comparativa de Planes (Básico, Plata, Oro).
  5. Checkout y pasarela de pago para contratación con Mercado Pago o Transferencia Bancaria.

---

## 4. 📱 URL de la Invitación Interactiva (`/invitacion`)

* **URL Directa:** `https://tuinvitaciondigital.netlify.app/invitacion`
* Permite a los clientes o invitados abrir directamente la tarjeta en pantalla completa del dispositivo móvil.

---

## ⚙️ Configuración de Rutas en Netlify (`public/_redirects`)

Para evitar errores `404 Not Found` al recargar directamente en rutas como `/Maximo1822` o `/cliente`, el proyecto cuenta con la regla de redirección estándar para Single Page Applications (SPA):

```text
/*    /index.html   200
```

Cualquier solicitud que llegue a Netlify es atendida por `index.html`, donde el router de React detecta la URL y despliega la vista correspondiente.
