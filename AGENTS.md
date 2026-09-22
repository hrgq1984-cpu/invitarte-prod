# INVITARTE / TU INVITACIÓN DIGITAL - RESUMEN MAESTRO PARA ANTIGRAVITY (AGENTS.MD)

> **Instrucción para el Agente Antigravity / Gemini:**
> Este documento contiene el contexto operativo, arquitectura, reglas de negocio, rutas y decisiones críticas de diseño del proyecto. Léelo con máxima prioridad para mantener la coherencia técnica y funcional al continuar el desarrollo.

---

## 1. Visión General del Proyecto
**InvitArte** (también referenciada comercialmente como **TuInvitacionDigital**) es una plataforma web integral para la venta, creación, personalización y distribución de invitaciones digitales interactivas para eventos sociales (Bodas, 15 Años, Cumpleaños, Bautismos, Comuniones, Baby Showers, Graduaciones).

* **Dominio Producción:** `https://tuinvitaciondigital.netlify.app`
* **Despliegue & Hosting:** Netlify (SPA con redirección `/* -> /index.html 200` en `public/_redirects`).
* **Titular / Administrador:** Héctor René González Quiroga (`hrgq.1984@gmail.com` | `+54 9 3835 438603`).

---

## 2. Stack Tecnológico
* **Frontend:** React 18, Vite, TypeScript.
* **Estilos:** Tailwind CSS v4.
* **Tipografías:** Google Fonts (`Cinzel`, `Montserrat`, `Pinyon Script`, `Playfair Display`).
* **Animaciones & Efectos:** `motion/react`, `canvas-confetti`.
* **Iconografía:** `lucide-react` únicamente.
* **Audio:** Web Audio API (`src/lib/audioSynth.ts`) para sintetizar música ambiental polifónica sin fallos de CORS ni dependencias externas.
* **Persistencia Dual (Cloud + Local):** React Context (`src/lib/store.tsx`) + Google Cloud Firestore activo (Project ID `gen-lang-client-0637251409`, Database ID `ai-studio-tuinvitaciondigi-c1d22d6e-1ee4-4a41-a4b9-4f3e83a11ae2`) + `localStorage` tolerante a cuotas (`safeSetLocalStorage`).
* **Especificaciones Completas:** Consultar `/SYSTEM_SPECIFICATIONS.md` para el detalle exhaustivo de contratos TypeScript, 21 plantillas, reglas de Firestore y flujo de renderizado dinámico.

---

## 3. Rutas y Accesos del Sistema

| Ruta | Propósito | Acceso / Credenciales |
|---|---|---|
| `/` | **Catálogo Público y Venta:** Explorador de 21 plantillas por categoría, tabla de planes, simulador interactivo de celular y pasarela de checkout con subida de comprobante. | Público y abierto. |
| `/Maximo1822` | **Panel Super-Administrador:** Moderación de pedidos y comprobantes bancarios, aprobación/rechazo de pagos, ajuste de precios en vivo, control de mensajes y fotos, creación manual de eventos, descarga de respaldos JSON. | **Clave Maestra:** `Maximo1822.@` (también acepta `Maximo1822`, `maximo1822`, `1822`). |
| `/cliente` | **Panel del Cliente / Anfitriones:** Configuración de fecha, cuenta regresiva, salón, mapa Google Maps, datos de regalo (CBU/Alias), Dress Code, generador de enlaces de WhatsApp personalizados por invitado, tabla RSVP y lanzador de Pantalla TV. | Correo electrónico del cliente o slug del evento. |
| `/:slug` o `/invitacion` | **Invitación Interactiva para Invitados:** Apertura de sobre con cera 3D, música ambiental, cuenta regresiva, confirmación RSVP con pase para adultos/niños, agendar en Google Calendar, muro de fotos del evento y libro de bendiciones. | Acceso por enlace de WhatsApp con token individual (`?guest=TOKEN`) o directo. |
| `#tv` (o Vista TV) | **Pantalla TV Salón:** Modo proyector a pantalla completa con bienvenida animada, carrusel 3D Coverflow de fotos y Código QR en vivo para que los invitados transmitan fotos durante la fiesta. | Acceso desde el panel de cliente o parámetro `#tv`. |

---

## 4. Planes Comerciales y Datos Bancarios

### Tarifas Oficiales (Pesos Argentinos - ARS)
* **Plan Bronce ($45.000 ARS):** Hasta 100 invitados, diseño interactivo estándar, apertura de sobre, cuenta regresiva, confirmación RSVP, mapa GPS, datos bancarios.
* **Plan Plata ($52.000 ARS):** Hasta 250 invitados, carrusel de hasta 7 fotos, música de fondo interactiva, código de vestimenta, enlaces de WhatsApp personalizados.
* **Plan Oro ($60.000 ARS):** Hasta 500 invitados, carrusel de hasta 15 fotos, Pantalla de TV en directo para el salón con QR para que los invitados suban fotos en vivo y rotación 3D Coverflow.

*(Nota: Los precios pueden editarse en tiempo real desde el Panel Admin sin necesidad de volver a compilar el código).*

### Datos Bancarios Oficiales de Cobro
* **Titular:** Héctor René González Quiroga
* **CUIT/CUIL:** 20-30949816-0
* **Alias:** `hgonzalez.bru.2499`
* **CBU:** `1430001713024956100018`
* **Cuenta:** `1302495610001`
* **Email de Aviso:** `hrgq.1984@gmail.com`
* **WhatsApp Soporte:** `+54 9 3835 438603`

---

## 5. Arquitectura del Código y Archivos Clave

* **`src/types.ts`:** Define todos los contratos TypeScript (`Project`, `EventSettings`, `Guest`, `Plan`, `DesignTemplate`, `PaymentTransaction`, `AdminNotification`, `Blessing`, `EventPhoto`).
* **`src/data/initialData.ts`:** Catálogo oficial de plantillas por categoría, planes predeterminados y estructura inicial limpia (sin pedidos demo ficticios).
* **`src/lib/store.tsx`:** Estado global (`useStore`) que orquesta toda la lógica de negocio:
  - Registro de pedidos (`createProjectOrder`).
  - Validación y aprobación de pagos (`approvePayment`, `rejectPayment`).
  - Gestión de invitados y confirmación RSVP (`updateGuestAttendance`, `bulkImportGuests`).
  - Muro de bendiciones y fotos del evento con moderación.
  - Sincronización en `localStorage` mediante `safeSetLocalStorage` para prevenir errores de cuota.
* **`src/lib/imageCompression.ts`:** **Módulo crítico.** Comprime imágenes en el navegador mediante canvas (máx 800-1000px, calidad 0.75 JPEG/WebP) convirtiendo archivos de 5-10MB a datos ultra-livianos de ~40-80KB.
* **`src/components/AdminDashboard.tsx`:** Panel de administración general con métricas, lista de pedidos, visualizador de comprobantes con zoom, gestión de precios, creación manual de eventos y descarga de backups.
* **`src/components/ClientDashboard.tsx`:** Panel del anfitrión para personalizar su invitación y gestionar invitados.
* **`src/components/InvitationView.tsx`:** La experiencia de la invitación digital en móvil y escritorio.
* **`src/components/TvDisplayModal.tsx`:** Modo proyector / pantalla de TV para el salón de fiesta.
* **`src/components/CheckoutModal.tsx`:** Flujo de compra, selección de plan, datos bancarios con botón de copia rápida y subida comprimida de comprobante.

---

## 6. Reglas Críticas para Futuras Modificaciones (¡IMPORTANTE PARA ANTIGRAVITY!)

1. **Compresión de Imágenes Obligatoria:**
   - **NUNCA** guardar en `localStorage` o en el store imágenes crudas (`FileReader.readAsDataURL` directo sin pasar por `compressImageFile`). De lo contrario, un archivo de 5MB dispara `QuotaExceededError` y rompe la persistencia del navegador.
   - Utilizar siempre `compressImageFile(file, maxWidth, maxHeight, quality)` de `src/lib/imageCompression.ts`.

2. **No Reintroducir Datos Demo Ficticios:**
   - Los pedidos demo anteriores (`Camila & Lautaro`, `Valentina`, `Mateo`) fueron removidos.
   - El sistema cuenta con la función `isDemoProject` para mantener limpia la lista de proyectos y asegurar que solo figuren pedidos reales ingresados por clientes o por el administrador.

3. **Autenticación y Clave Maestra:**
   - La pantalla de login del panel `/Maximo1822` se valida en `loginAdmin` dentro de `src/lib/store.tsx`. Mantener compatibilidad con la clave `Maximo1822.@` y sus alias prácticos.

4. **Navegación SPA y Netlify:**
   - Si se agregan nuevas rutas o subrutas, verificar que se mantenga la compatibilidad con el archivo `public/_redirects` (`/* /index.html 200`).

5. **Iconos y Estilos:**
   - Importar iconos exclusivamente de `lucide-react`.
   - Utilizar utilidades de Tailwind CSS v4 para el diseño responsivo sin crear archivos CSS adicionales.
