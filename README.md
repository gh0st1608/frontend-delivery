# FoodStore SDC — Frontend Delivery (Mobile)

App móvil del cliente de **FoodStore SDC**: catálogo de productos y restaurantes, carrito, checkout, pago y seguimiento del pedido en tiempo real con el repartidor en el mapa.

Construida con **Expo (SDK 54)**, **React Native 0.81** y **Expo Router**. Corre en Android, iOS y Web desde el mismo código.

## Stack

| Área | Tecnología |
| --- | --- |
| Framework | Expo 54, React Native 0.81 (New Architecture), React 19, TypeScript |
| Navegación | Expo Router 6 (rutas tipadas), React Navigation (bottom tabs) |
| Estado | Zustand (`store/`), React Context para autenticación (`context/`) |
| HTTP | Axios con interceptores (token Bearer desde AsyncStorage) |
| Tiempo real | Socket.IO client (tracking de pedidos) |
| Mapas | `react-native-maps` (nativo) y Leaflet / `react-leaflet` (web), Google APIs para geocoding/rutas, `@mapbox/polyline` |
| Pagos | PayPal (vía microservicio de pagos) |
| Build / Deploy | EAS Build (móvil), AWS CodeBuild + S3 + CloudFront (web) |

## Requisitos

- Node.js 18 o superior
- npm
- [Expo Go](https://expo.dev/go) en el dispositivo, o un emulador Android / simulador iOS
- (Opcional) `eas-cli` para generar builds: `npm install -g eas-cli`

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz (no se versiona) con las siguientes variables:

```env
EXPO_PUBLIC_API_URL_AUTH=
EXPO_PUBLIC_API_URL_SHOP=
EXPO_PUBLIC_API_URL_CHECKOUT=
EXPO_PUBLIC_API_URL_ORDER=
EXPO_PUBLIC_API_URL_PAYMENT=
EXPO_PUBLIC_SOCKET_URL=
EXPO_PUBLIC_API_KEY_GOOGLE=
EXPO_PUBLIC_API_URL_GOOGLE=
```

| Variable | Uso |
| --- | --- |
| `EXPO_PUBLIC_API_URL_AUTH` | Microservicio de autenticación y usuarios |
| `EXPO_PUBLIC_API_URL_SHOP` | Catálogo: productos, categorías, carrito |
| `EXPO_PUBLIC_API_URL_CHECKOUT` | Checkout del pedido |
| `EXPO_PUBLIC_API_URL_ORDER` | Pedidos |
| `EXPO_PUBLIC_API_URL_PAYMENT` | Pagos (PayPal: creación y confirmación) |
| `EXPO_PUBLIC_SOCKET_URL` | Servidor Socket.IO para el tracking en tiempo real |
| `EXPO_PUBLIC_API_KEY_GOOGLE` | API key de Google (geocoding / rutas) |
| `EXPO_PUBLIC_API_URL_GOOGLE` | URL base de las APIs de Google |

Las variables se leen en [constants/config.ts](constants/config.ts) y en [api/socket/clients/socket.client.ts](api/socket/clients/socket.client.ts). Al cambiarlas, reinicia el bundler con `npx expo start -c`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Abre la app en Android |
| `npm run ios` | Abre la app en iOS |
| `npm run web` | Abre la app en el navegador |
| `npm run lint` | Ejecuta ESLint (`eslint-config-expo`) |

## Estructura del proyecto

```
app/                    Rutas (Expo Router, basado en archivos)
├── index.tsx           Redirección según el estado de autenticación
├── auth/               Login, registro, verificación de email, recuperar contraseña
├── onboarding/         Selección de categorías preferidas
├── (tabs)/             Home, búsqueda, favoritos, notificaciones, perfil
└── (stack)/            Producto, carrito, checkout, pago, tracking, ajustes
api/
├── http/
│   ├── clients/        Instancias de Axios por microservicio
│   ├── interceptors/   Inyección del token y manejo de respuestas
│   ├── services/       Llamadas a la API por dominio
│   └── types/          Tipos de request/response
└── socket/             Cliente Socket.IO, canales y servicio de tracking
components/             Componentes de UI agrupados por pantalla
hooks/                  Lógica de cada pantalla (use-cart, use-order-tracking, ...)
store/                  Stores de Zustand (carrito, checkout)
context/                AuthContext
constants/              Configuración y tema
utils/                  Storage, manejo de errores, fases de tracking
mocks/                  Datos de prueba
assets/, public/        Imágenes, íconos y SVG
```

Los componentes con implementación distinta por plataforma usan los sufijos `.native.tsx` y `.web.tsx` (por ejemplo `components/tracking/map-route.*`), y Metro elige el archivo correcto según la plataforma.

## Flujo de la app

1. **Autenticación**: [app/index.tsx](app/index.tsx) redirige según el estado del `AuthContext`: login, onboarding de categorías o home.
2. **Catálogo**: home con categorías, productos y restaurantes; búsqueda y favoritos.
3. **Carrito y checkout**: el carrito y el checkout viven en stores de Zustand; en el checkout se elige la dirección de entrega en el mapa.
4. **Pago**: se crea el pago en PayPal y se confirma desde las pantallas `payment/processing`, `success` y `failure`.
5. **Tracking**: la pantalla `tracking/[orderId]` se suscribe por Socket.IO a los eventos `order.tracking.updated` y `order.courier.assigned` y muestra la ruta del repartidor.

Fases del tracking ([utils/tracking-phase.ts](utils/tracking-phase.ts)):

```
ASSIGNED → PREPARING → TO_PICKUP → PICKED_UP → ON_THE_WAY → TO_DROPOFF → DELIVERED
```

## Convención de la API

Los servicios envuelven el payload en `Data` y esperan respuestas con `Data` o `Error`:

```jsonc
// Request
{ "Data": { "Payment": { /* ... */ } } }

// Respuesta OK
{ "Data": { /* ... */ } }

// Respuesta con error
{ "Error": { /* ... */ } }
```

El token de acceso se guarda en AsyncStorage (`access_token`) y el interceptor de request lo añade como `Authorization: Bearer <token>`.

## Build y despliegue

### Móvil (EAS)

Perfiles definidos en [eas.json](eas.json): `development`, `preview` y `production`.

```bash
eas login
eas build --profile preview --platform android
eas build --profile production --platform android
```

El package de Android es `com.solutionserj.foodstoresdc` ([app.config.js](app.config.js)).

> Las variables `EXPO_PUBLIC_*` no se suben con el `.env` (está en `.gitignore`). Para los builds en EAS hay que definirlas como variables de entorno del proyecto en EAS o en el bloque `env` de cada perfil.

### Web (AWS)

[buildspec.yml](buildspec.yml) (AWS CodeBuild) ejecuta:

1. `npx expo export --platform web` → genera `dist/`
2. Sincroniza `dist/` con el bucket S3 `foodstore.solutionserj.com`
3. Invalida la caché de CloudFront

Para generar el build web en local:

```bash
npx expo export --platform web
```

## Ramas

- `main`: rama principal
- `develop`: desarrollo
