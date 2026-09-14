# Documentación Técnica - Plataforma InvitArte (Invitaciones Digitales Interactivas)

## 1. Visión General del Proyecto
InvitArte es una plataforma comercial de alta gama para la creación, personalización, distribución y gestión de invitaciones digitales interactivas para eventos sociales (Bodas, Cumpleaños, 15 Años, Bautismos, Comuniones, Confirmaciones y Otros).

### Especificaciones Comerciales
- **Planes Comerciales:**
  - **Plan Bronce:** $45.000 ARS (Hasta 100 invitados, diseño interactivo estándar, sobre de apertura, cuenta regresiva, confirmación de asistencia RSVP, mapa con geolocalización, regalos / datos bancarios).
  - **Plan Plata:** $52.000 ARS (Hasta 250 invitados, carrusel de hasta 7 fotos, música de fondo interactiva, código de vestimenta, enlaces personalizados por WhatsApp).
  - **Plan Oro:** $60.000 ARS (Hasta 500 invitados, carrusel de hasta 15 fotos, pantalla de TV en directo para el salón de fiesta con rotación 3D Coverflow y código QR en pantalla para subida de fotos por los invitados en tiempo real).
- **Garantía y Flujo de Revisión:** Ventana de revisión activa de 24 horas después del pago previo a la publicación definitiva.
- **Retención de Fotos de Invitados:** Carpeta Google Drive disponible durante 10 días posteriores a la fecha del evento.
- **Contacto Oficial de Soporte y Cobranza:**
  - **Correo electrónico:** `hrgq.1984@gmail.com`
  - **WhatsApp:** `+54 9 3835 438603` (o `3835438603`)

---

## 2. Arquitectura de Software & Stack Tecnológico

| Capa | Tecnología | Función Principal |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | SPA de alto rendimiento y carga instantánea |
| **Lenguaje** | TypeScript | Tipado estricto de modelos, esquemas y estados |
| **Estilos & UI** | Tailwind CSS v4 | Diseño responsivo fluido, sin lag |
| **Tipografía** | Google Fonts | `Cinzel`, `Montserrat`, `Pinyon Script`, `Playfair Display` |
| **Animaciones** | Motion + Canvas Confetti | Apertura de sobre de cera y celebraciones |
| **Audio** | Web Audio API + HTML5 Audio | Síntesis polifónica sin corte y reproducción musical |
| **Almacenamiento Reactivo** | React Context (`useStore`) + LocalStorage | Persistencia reactiva inmediata con tolerancia a fallas de red |
| **Backend & DB** | Firebase Firestore | Base de datos NoSQL documental tipificada |
| **Seguridad** | Firestore Security Rules (ABAC) | Autorización por atributos y roles (Admin vs Propietario) |
| **Hosting Frontend** | Netlify | CI/CD automático conectado a GitHub |
| **Pruebas Automatizadas** | Vitest | Suite de validación de cuotas, precios y lógica de negocio |

---

## 3. Modelo de Datos (Firestore IR & Schemas)

Consulte el archivo fuente `firebase-blueprint.json` para las definiciones completas.

### Colecciones Principales
1. **/users/{userId}**
   - `role`: `'admin' | 'client'`
   - `email`: `string`
   - `phone`: `string`
   - `displayName`: `string`

2. **/plans/{planId}**
   - `name`: `string`
   - `price`: `number` (ARS)
   - `maxGuests`: `number`
   - `maxInvitationPhotos`: `number`
   - `hasTvMode`: `boolean`

3. **/templates/{templateId}** (21 Modelos, 3 por tipo de evento)
   - `name`, `eventType`, `previewImage`, `samplePhrase`, `palette`, `requiredPlan`

4. **/projects/{projectId}**
   - `clientId`: `string`
   - `status`: `'draft' | 'pending_payment' | 'preview_available' | 'approved' | 'published'`
   - `publicSlug`: `string`
   - `settings`: `EventSettings` (Nombres, fecha, horas ceremonia/fiesta, salón, mapa, CBU/Alias, vestimenta, música)

5. **/projects/{projectId}/guests/{guestId}**
   - `name`: `string`
   - `relationship`: `string`
   - `phone`: `string`
   - `adultsMax`, `childrenMax`: `number`
   - `attendance`: `'pending' | 'confirmed' | 'declined'`
   - `inviteToken`: `string` (identificador único para URL de WhatsApp)

6. **/projects/{projectId}/blessings/{blessingId}**
   - `author`: `string`
   - `message`: `string`
   - `status`: `'pending' | 'approved' | 'rejected'`

7. **/projects/{projectId}/photos/{photoId}**
   - `photoUrl`: `string`
   - `status`: `'pending' | 'approved' | 'rejected'`

---

## 4. Despliegue Continuo en Netlify & GitHub

### Archivos de Configuración Incluidos:
- **`netlify.toml`**: Configura el comando de compilación (`npm run build`), directorio de salida (`dist`) y encabezados de seguridad (X-Frame-Options, CSP, HSTS).
- **`public/_redirects`**: Asegura que cualquier ruta (`/*`) se reenvíe a `/index.html` con status `200` para soportar navegación SPA.

### Pasos para Activar en Producción:
1. Subir el repositorio a GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: InvitArte complete platform implementation"
   git remote add origin https://github.com/<usuario>/invitarte.git
   git branch -M main
   git push -u origin main
   ```
2. Iniciar sesión en [Netlify](https://app.netlify.com).
3. Seleccionar **"Add new site"** > **"Import an existing project"** > **GitHub**.
4. Seleccionar el repositorio `invitarte`.
5. Netlify detectará automáticamente:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. En **Site configuration** > **Environment variables**, añadir las claves de Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
7. Hacer clic en **Deploy**. Cada commit nuevo en GitHub desencadenará un despliegue automático.

---

## 5. Despliegue de Reglas en Firebase

Para publicar las reglas de seguridad de Firestore (`firestore.rules`):
```bash
# Iniciar sesión en Firebase CLI
firebase login

# Seleccionar el proyecto
firebase use <tu-project-id>

# Desplegar únicamente las reglas de Firestore
firebase deploy --only firestore:rules
```

---

## 6. Pruebas Automatizadas

Se dispone de una suite de pruebas con Vitest en `src/lib/store.test.ts`.

Para ejecutar las pruebas:
```bash
npm run test
```

Valida:
- Catálogo de 21 modelos íntegro (3 por categoría).
- Cálculo y consistencia de precios de planes ($45k, $52k, $60k).
- Importador masivo de invitados desde CSV.
- Consistencia del estado de revisión de 24 horas.

---

## 7. Mantenimiento y Extensibilidad
- **Modificación de Precios:** El Super-Administrador puede ajustar los precios en tiempo real desde `/` seleccionando la pestaña **Panel Admin** > **Precios & Planes Comerciales**, sin necesidad de redeployar código.
- **Descarga de Respaldos:** La pestaña **Panel Admin** incluye el botón **"Descargar Respaldo JSON"** para exportar toda la base de datos de proyectos, invitados y fotos en cualquier momento.
