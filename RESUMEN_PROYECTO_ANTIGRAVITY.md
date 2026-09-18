# INVITARTE / TU INVITACIÓN DIGITAL - RESUMEN DEL PROYECTO PARA ANTIGRAVITY

> Este archivo contiene el resumen completo y estructurado de la plataforma, arquitectura, rutas, credenciales y pautas técnicas para que el agente **Antigravity** pueda continuar el desarrollo sin fricciones.
> *(Nota: El archivo `AGENTS.md` en la raíz contiene las mismas directivas y es inyectado automáticamente en las instrucciones de Antigravity).*

---

## 1. Visión General & Dominio
* **Nombre de la Plataforma:** InvitArte / TuInvitacionDigital
* **Propósito:** Plataforma web para la venta, personalización y distribución de invitaciones digitales interactivas para eventos sociales (Bodas, 15 Años, Bautismos, Comuniones, Cumpleaños y otros).
* **URL de Producción:** `https://tuinvitaciondigital.netlify.app`
* **Administrador General:** Héctor René González Quiroga (`hrgq.1984@gmail.com` | `+54 9 3835 438603`)

---

## 2. Stack Tecnológico
* **Frontend:** React 18, Vite, TypeScript.
* **Estilos:** Tailwind CSS v4.
* **Tipografías:** Google Fonts (`Cinzel`, `Montserrat`, `Pinyon Script`, `Playfair Display`).
* **Animaciones & Efectos:** `motion/react`, `canvas-confetti`.
* **Iconos:** `lucide-react` (exclusivo).
* **Audio:** Web Audio API (`src/lib/audioSynth.ts`) para síntesis ambiental polifónica sin fallos de red ni problemas de CORS.
* **Persistencia:** React Context (`src/lib/store.tsx`) + `localStorage` tolerante a cuotas (`safeSetLocalStorage`) + arquitectura lista para Firebase Firestore (`firebase-blueprint.json` y `firestore.rules`).
* **Hosting:** Netlify con soporte SPA mediante `public/_redirects` (`/* /index.html 200`).

---

## 3. Mapa de Rutas y Accesos

| Módulo | Ruta | Acceso & Credenciales | Descripción |
|---|---|---|---|
| **Catálogo & Venta** | `/` | Público | Catálogo interactivo de 21 modelos, simulador móvil, comparativa de planes y checkout con comprobante bancario. |
| **Super-Administrador** | `/Maximo1822` | **Clave Maestra:** `Maximo1822.@` (o `Maximo1822`, `1822`) | Moderación de comprobantes, aprobación/rechazo de pedidos, edición de precios en tiempo real, creación manual de eventos y descarga de respaldos JSON. |
| **Portal Clientes** | `/cliente` | Email del cliente o slug del evento | Editor de fechas, lugares, enlaces de Google Maps, datos de regalos (CBU/Alias), generador masivo de enlaces personalizados de WhatsApp y tabla RSVP. |
| **Invitación Interactiva** | `/:slug` o `/invitacion` | Token individual `?guest=TOKEN` o público | Apertura de sobre con cera 3D, música, cuenta regresiva, confirmación de asistencia, agendar en Google Calendar, muro de fotos y dedicatorias. |
| **Pantalla TV Salón** | `#tv` | Botón desde panel cliente o ancla `#tv` | Modo pantalla completa para proyectores del salón con rotación 3D Coverflow y Código QR para subida de fotos en tiempo real. |

---

## 4. Planes Comerciales y Datos Bancarios Oficiales

### Planes (ARS)
* **Plan Bronce ($45.000 ARS):** Hasta 100 invitados, diseño interactivo estándar, apertura de sobre, cuenta regresiva, confirmación RSVP, mapa GPS, datos bancarios.
* **Plan Plata ($52.000 ARS):** Hasta 250 invitados, carrusel de hasta 7 fotos, música de fondo, código de vestimenta, enlaces de WhatsApp personalizados.
* **Plan Oro ($60.000 ARS):** Hasta 500 invitados, carrusel de hasta 15 fotos, Pantalla de TV interactiva con QR en directo para el salón.

### Datos Bancarios Oficiales para Cobros
* **Titular:** Héctor René González Quiroga
* **CUIT/CUIL:** 20-30949816-0
* **Alias:** `hgonzalez.bru.2499`
* **CBU:** `1430001713024956100018`
* **Cuenta:** `1302495610001`
* **Email de Notificación:** `hrgq.1984@gmail.com`
* **WhatsApp Soporte:** `+54 9 3835 438603`

---

## 5. Estructura de Archivos del Código

```
├── AGENTS.md                         # Directivas inyectadas en Antigravity
├── RESUMEN_PROYECTO_ANTIGRAVITY.md   # Este resumen completo
├── TECHNICAL_DOCUMENTATION.md        # Documentación técnica extendida
├── URLS.md                           # Guía detallada de URLs y accesos
├── public/_redirects                 # Regla SPA para Netlify
├── src/
│   ├── types.ts                      # Tipos e interfaces globales
│   ├── data/
│   │   └── initialData.ts            # Modelos, plantillas y planes iniciales limpios
│   ├── lib/
│   │   ├── store.tsx                 # Estado global, persistencia segura y lógica de negocio
│   │   ├── imageCompression.ts       # Compresión client-side de fotos y comprobantes
│   │   └── audioSynth.ts             # Síntesis Web Audio para melodías ambientales
│   ├── components/
│   │   ├── AdminDashboard.tsx        # Panel de Super-Administrador (/Maximo1822)
│   │   ├── ClientDashboard.tsx       # Panel del Anfitrión (/cliente)
│   │   ├── InvitationView.tsx        # Vista de la invitación interactiva
│   │   ├── TvDisplayModal.tsx        # Modo Pantalla TV para salones de fiesta
│   │   └── CheckoutModal.tsx         # Pasarela de compra con carga de comprobante
│   ├── App.tsx                       # Enrutador principal y layout
│   └── main.tsx                      # Entry point de la app
```

---

## 6. Pautas Técnicas Críticas para Continuar el Proyecto

1. **Compresión Obligatoria de Imágenes:**
   - Cualquier archivo de imagen subido por el cliente o invitado (comprobante de pago, fotos de carrusel, fotos del evento) **DEBE** pasar por `compressImageFile` de `src/lib/imageCompression.ts` antes de ser almacenado. Esto mantiene el tamaño entre 30KB y 80KB y evita errores de cuota (`QuotaExceededError`) en `localStorage`.
2. **Sin Pedidos Ficticios:**
   - La base de datos local inicia vacía de pedidos demo. La función `isDemoProject` filtra activamente los identificadores de pruebas antiguas para que la bandeja del administrador solo refleje compras reales.
3. **Persistencia Segura:**
   - La función `safeSetLocalStorage` en `src/lib/store.tsx` maneja automáticamente cualquier intento de saturación del navegador liberando cachés secundarias antes de descartar datos críticos.
4. **Seguridad y Accesibilidad:**
   - El acceso al panel `/Maximo1822` se valida en la función `loginAdmin` de `src/lib/store.tsx`.
