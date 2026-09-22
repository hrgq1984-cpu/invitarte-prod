# ESPECIFICACIONES TÉCNICAS Y GUÍA DE ARQUITECTURA DEL SISTEMA
## Proyecto: InvitArte / Tu Invitación Digital

> **Documento Maestro de Arquitectura y Especificaciones de Sistema**  
> Diseñado para que cualquier desarrollador, agente de inteligencia artificial (Gemini, Claude, GPT, Antigravity) u operador técnico comprenda, mantenga y continúe la evolución de la plataforma sin inconsistencias funcionales ni regresiones técnicas.

---

## 1. Ficha del Proyecto e Información General

* **Nombre de la Aplicación:** InvitArte (Comercialmente: *Tu Invitación Digital*)
* **Propósito:** Plataforma web integral para la venta, diseño, personalización, gestión y distribución de invitaciones digitales interactivas para eventos sociales (Bodas, 15 Años, Cumpleaños infantiles y de adultos, Bautismos, Comuniones, Baby Showers y Graduaciones).
* **URL de Producción Oficial:** `https://tuinvitaciondigital.netlify.app`
* **Hosting y Despliegue:** Netlify (Single Page Application con redirección `/* -> /index.html 200` en `public/_redirects`).
* **Titular / Administrador General:**
  * **Nombre:** Héctor René González Quiroga
  * **Email:** `hrgq.1984@gmail.com`
  * **Teléfono / WhatsApp de Soporte:** `+54 9 3835 438603`
  * **CUIT/CUIL:** 20-30949816-0
  * **Datos Bancarios de Cobro:**
    * **Alias:** `hgonzalez.bru.2499`
    * **CBU:** `1430001713024956100018`
    * **N° de Cuenta:** `1302495610001`

---

## 2. Stack Tecnológico y Dependencias

* **Frontend Core:** React 18 (`react`, `react-dom`), Vite 6, TypeScript 5.
* **Estilos y Maquetación:** Tailwind CSS v4 (`@tailwindcss/vite` y `@import "tailwindcss";` en `src/index.css`).
* **Tipografías (Google Fonts en `index.html`):**
  * `Cinzel` (Bodas elegantes, estilo clásico/romano).
  * `Montserrat` (Cuerpo legible y estilos modernos/geométricos).
  * `Pinyon Script` (Cursiva caligráfica para 15 años y bodas de gala).
  * `Playfair Display` (Serif editorial para eventos premium).
* **Animaciones e Interactividad:**
  * `motion/react` (Transiciones fluidas, apertura de sobres, modales).
  * `canvas-confetti` (Explosión de confeti al abrir sobre y confirmar RSVP).
* **Iconografía:** `lucide-react` (exclusivo; no usar SVGs manuales ni otras bibliotecas de iconos).
* **Audio Autónomo:** Web Audio API (`src/lib/audioSynth.ts`) — sintetizador polifónico procedural nativo en el navegador que elimina dependencias de archivos MP3 externos y bloqueos por CORS.
* **Base de Datos y Persistencia en la Nube:**
  * **Firebase SDK:** v12+ (`firebase/app`, `firebase/firestore`, `firebase/auth`).
  * **Google Cloud Project ID:** `gen-lang-client-0637251409`.
  * **Database ID:** `ai-studio-tuinvitaciondigi-c1d22d6e-1ee4-4a41-a4b9-4f3e83a11ae2`.
  * **Configuración:** `firebase-applet-config.json` y `firestore.rules`.
  * **Caché Local / Offline-First:** `localStorage` con sanitización `safeSetLocalStorage`.

---

## 3. Estructura de Directorios y Archivos Clave

```
├── .env.example                     # Variables de entorno documentadas (no sensibles)
├── firebase-applet-config.json      # Configuración de credenciales de Firebase en la applet
├── firebase-blueprint.json          # Esquema relacional documental para Firestore
├── firestore.rules                  # Reglas de seguridad para Firestore desplegadas
├── index.html                       # Entry point HTML con tipografías y metadatos SEO
├── metadata.json                    # Metadatos del sistema (nombre, descripción, capacidades)
├── package.json                     # Scripts y dependencias de npm
├── public/
│   ├── _redirects                   # Redirección Netlify SPA: /* /index.html 200
│   └── favicon.svg                  # Icono de la aplicación
├── src/
│   ├── main.tsx                     # Montaje de React y providers
│   ├── App.tsx                      # Enrutador principal del cliente (state router)
│   ├── index.css                    # Entry point de Tailwind CSS v4
│   ├── types.ts                     # Definiciones e interfaces TypeScript del sistema
│   ├── data/
│   │   └── initialData.ts           # Catálogo oficial de 21 plantillas y planes comerciales
│   ├── lib/
│   │   ├── audioSynth.ts            # Motor Web Audio API (melodías polifónicas en tiempo real)
│   │   ├── firebase.ts              # Inicialización de Firebase con fallback offline
│   │   ├── imageCompression.ts      # Compresor en canvas para fotos y comprobantes
│   │   └── store.tsx                # Contexto global (useStore), lógica de negocio y persistencia
│   └── components/
│       ├── AdminDashboard.tsx       # Panel de control de Super-Administrador (/Maximo1822)
│       ├── CheckoutModal.tsx        # Pasarela de compra con copia bancaria y subida de comprobante
│       ├── ClientDashboard.tsx      # Panel de configuración para anfitriones (/cliente)
│       ├── InvitationView.tsx       # Vista interactiva del invitado (móvil y escritorio)
│       ├── TechDocsModal.tsx        # Modal de documentación técnica integrada
│       └── TvDisplayModal.tsx       # Modo pantalla completa TV Salón con carrusel 3D y QR
```

---

## 4. Rutas, Accesos y Credenciales del Sistema

El sistema implementa un enrutador SPA basado en el path de la URL del navegador y parámetros de consulta (`window.location.pathname` y `window.location.search`):

| Ruta / URL | Pantalla / Módulo | Acceso y Credenciales |
|---|---|---|
| `/` | **Catálogo y Landing Comercial** | Acceso público. Exploración por categorías de evento, selector de planes, simulador interactivo de celular y botón de compra. |
| `/Maximo1822` | **Panel Super-Administrador** | **Clave Maestra:** `Maximo1822.@` *(acepta también variantes `Maximo1822`, `maximo1822`, `1822`)*. Permite moderar comprobantes de pago bancarios, aprobar/rechazar proyectos, cambiar precios de planes en tiempo real, crear eventos manualmente y descargar/restaurar backups en JSON. |
| `/cliente` | **Panel del Anfitrión / Cliente** | Acceso por correo electrónico registrado o slug del evento. Permite configurar nombres, fecha, salón, itinerario, CBU/Alias para regalos, lista de invitados con pases y links de WhatsApp personalizados. |
| `/:slug` o `/invitacion` | **Invitación Interactiva para Invitados** | Acceso mediante enlace directo o token de invitado (`?guest=ID_INVITADO`). Incluye apertura de sobre con sello de cera 3D, música ambiental, cuenta regresiva, confirmación RSVP, agendar en Google Calendar, cómo llegar con GPS, muro de bendiciones y álbum de fotos. |
| `#tv` (o botón Modo TV) | **Pantalla TV para el Salón de Fiestas** | Acceso desde el panel del anfitrión o agregando `#tv` en la URL. Proyección a pantalla completa, rotación 3D Coverflow de fotos y código QR para que los invitados transmitan fotos en vivo durante la celebración. |

---

## 5. Planes Comerciales y Reglas de Negocio

El sistema cuenta con 3 niveles de servicio oficiales (los precios son actualizables en vivo desde `/Maximo1822` y se persisten automáticamente):

1. **Plan Bronce ($45.000 ARS):**
   * Límite: Hasta 100 invitados.
   * Apertura de sobre animada con lacre 3D.
   * Cuenta regresiva interactiva en vivo.
   * Confirmación de asistencia RSVP en tiempo real.
   * Mapa GPS interactivo hacia la ceremonia y salón.
   * Datos bancarios (CBU / Alias) para regalos.
2. **Plan Plata ($52.000 ARS):**
   * Límite: Hasta 250 invitados.
   * Todo lo incluido en el Plan Bronce.
   * Carrusel fotográfico de hasta 7 imágenes con compresión automática.
   * Música de fondo interactiva polifónica (sintetizador Web Audio).
   * Tarjeta visual de Código de Vestimenta (Dress Code).
   * Generador de enlaces de WhatsApp personalizados por cada invitado.
3. **Plan Oro ($60.000 ARS):**
   * Límite: Hasta 500 invitados.
   * Todo lo incluido en el Plan Plata.
   * Carrusel fotográfico ampliado de hasta 15 imágenes.
   * **Modo Pantalla de TV en Directo:** Visualizador para proyector o pantalla gigante del salón con carrusel 3D Coverflow y código QR en vivo para que los invitados transmitan fotos durante la fiesta.
   * Muro de bendiciones con moderación del anfitrión.

---

## 6. Persistencia y Almacenamiento Híbrido

### Capa 1: Cloud Firestore (Persistencia Maestra)
* **SDK:** Firebase JS v12.
* **Database ID:** `ai-studio-tuinvitaciondigi-c1d22d6e-1ee4-4a41-a4b9-4f3e83a11ae2`.
* **Colecciones en uso:**
  * `projects`: Proyectos y pedidos (slug, estado de pago, plan contratado, datos de anfitriones).
  * `event_settings`: Configuraciones de fechas, ubicaciones, CBU, dress code y canciones.
  * `guests`: Invitados vinculados a cada proyecto con tokens únicos, pases y estado de asistencia (confirmed, declined, pending).
  * `blessings`: Dedicatorias y firmas de los invitados.
  * `photos`: Galería de imágenes del evento y fotos transmitidas desde la fiesta.
  * `payments`: Registro de comprobantes bancarios subidos por los clientes con montos y estados (`pending`, `approved`, `rejected`).
  * `plans`: Configuración de precios oficiales administrables en vivo.
* **Reglas de Seguridad:** Definidas en `firestore.rules`. Las lecturas y escrituras requieren Firebase Auth; el propietario se valida por `clientEmail` y el administrador por el custom claim `admin: true`. Después de crear usuarios, es obligatorio desplegar las reglas actualizadas.

### Autenticación Firebase obligatoria
* El panel administrador usa email/contraseña de Firebase Auth y requiere el custom claim `admin: true`.
* El panel cliente usa email/contraseña de Firebase Auth y solo puede acceder a proyectos cuyo `clientEmail` coincide con la cuenta autenticada.
* El acceso demo es local y explícito; no concede permisos de Firestore.
* No se deben volver a guardar sesiones, contraseñas o roles confiables en `localStorage`.

### Capa 2: LocalStorage con Tolerancia a Fallos
* Se utiliza `safeSetLocalStorage(key, value)` en `src/lib/store.tsx` para atrapar cualquier excepción de cuota (`QuotaExceededError`).
* Si el navegador entra en modo incógnito o la base de datos de Firebase estuviese temporalmente fuera de línea, la aplicación sigue funcionando de manera continua sin caídas ni pantallas blancas.

### Capa 3: Compresión Obligatoria de Imágenes (`src/lib/imageCompression.ts`)
* **Regla estricta:** Ninguna imagen (ni fotos de portada, ni fotos del carrusel, ni comprobantes bancarios) se guarda cruda en base64.
* Cada archivo subido pasa por `compressImageFile(file, maxWidth, maxHeight, quality)`:
  * Redimensiona en un elemento `HTMLCanvasElement` a máximo 800-1000px.
  * Comprime a formato JPEG/WebP calidad 0.75.
  * Convierte archivos pesados de 5-10MB en cadenas livianas de ~40-80KB, previniendo el desbordamiento de cuotas y garantizando tiempos de carga ultrarrápidos en dispositivos móviles 4G/3G.

---

## 7. Catálogo de Plantillas y Motor de Renderizado Dinámico

La aplicación incluye **21 plantillas preconfiguradas** en `src/data/initialData.ts`, distribuidas por categorías:
* **Bodas:** `boda-clasica`, `boda-vintage`, `boda-minimalista`, `boda-boho`.
* **15 Años:** `xv-princesa`, `xv-neon`, `xv-rose-gold`, `xv-glam`.
* **Cumpleaños Adultos:** `cumple-elegante`, `cumple-tropical`, `cumple-dorado`.
* **Cumpleaños Infantiles:** `infantil-dinos`, `infantil-espacial`, `infantil-magico`, `infantil-selva`.
* **Bautismos & Comuniones:** `bautismo-celeste`, `bautismo-rosa`, `comunion-angelical`.
* **Baby Showers:** `baby-nube`, `baby-bosque`.
* **Graduaciones:** `graduacion-formal`.

### Motor de Estilos Dinámicos (`src/components/InvitationView.tsx`)
Cada plantilla suministra:
* `primaryColor` (hexadecimal del tono principal).
* `secondaryColor` (hexadecimal del tono secundario).
* `fontFamily` (`Cinzel`, `Montserrat`, `Pinyon Script`, `Playfair Display`).
* `envelopeColor` (color exterior del sobre cerrado).
* `soundStyle` (identificador de melodía polifónica).

El componente calcula dinámicamente:
* `isColorDark(hex)`: Detecta luminancia para asegurar contraste WCAG en textos y botones.
* `hexToRgba(hex, alpha)`: Genera transparencias armónicas para fondos y acentos.
* Aplica el tema de forma integral a: Sobre 3D, Barra de audio, Cuenta regresiva, Itinerario, Muro de fotos y Libro de firmas.

---

## 8. Motor de Audio Sintetizado (`src/lib/audioSynth.ts`)

Para evitar errores de CORS, licencias de audio de terceros y descargas pesadas de archivos `.mp3`, la aplicación cuenta con un sintetizador por software basado en **Web Audio API**:
* Soporta 7 estilos musicales: `'romantic'`, `'celebration'`, `'classical'`, `'modern'`, `'acoustic'`, `'chill'`, `'party'`.
* Genera acordes y arpegios polifónicos mediante osciladores `sine` y `triangle` con envolventes de ganancia suaves (ADSR).
* Compatible con la política de autoplay de navegadores móviles (requiere toque de interacción del usuario al abrir el sobre o pulsar el botón de música).

---

## 9. Reglas Críticas para Continuidad de Desarrollo (Checklist para IAs)

1. **Prohibido Guardar Imágenes Sin Comprimir:**
   * Utilizar siempre `compressImageFile` de `src/lib/imageCompression.ts` antes de persistir cualquier imagen.
2. **No Reintroducir Datos Demo Ficticios:**
   * Los proyectos demo iniciales se han eliminado para mantener limpia la base de datos real.
   * La función `isDemoProject` filtra datos de prueba para que en producción solo aparezcan pedidos reales de clientes y del administrador.
3. **Clave Maestra del Administrador:**
   * La validación reside en `loginAdmin` dentro de `src/lib/store.tsx`. La clave principal es `Maximo1822.@` (y sus variantes prácticas). No modificar ni debilitar esta credencial.
4. **Preservar Compatibilidad SPA con Netlify:**
   * El archivo `public/_redirects` con la línea `/* /index.html 200` debe mantenerse siempre para que la recarga de URLs como `/Maximo1822`, `/cliente` o `/:slug` no arroje error 404 en Netlify.
5. **Iconos:**
   * Emplear exclusivamente componentes de `lucide-react`. No crear SVGs manuales ni importar bibliotecas externas de iconos.
6. **Diseño y Estilos:**
   * Emplear Tailwind CSS v4 con clases utilitarias directas y contraste verificado.
7. **Firebase y Configuración:**
   * Toda interacción con Firestore debe preservar `cleanForFirestore` para evitar campos `undefined`.

---

## 10. Comandos de Verificación y Compilación

* **Instalación:** `npm install`
* **Desarrollo:** `npm run dev` (Vite dev server en puerto 3000)
* **Verificación de Tipos:** `npm run lint` o `npx tsc --noEmit`
* **Compilación de Producción:** `npm run build` (genera directorio `/dist` listo para Netlify)
