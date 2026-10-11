# FoodStore SDC — Frontend Delivery (Mobile)

App móvil del cliente de **FoodStore SDC**: catálogo de productos, carrito, checkout, pago con PayPal y seguimiento del pedido en tiempo real con el repartidor en el mapa.

Construida con **Expo (SDK 54)**, **React Native 0.81** y **Expo Router**. Corre en Android, iOS y Web desde el mismo código. Consume los microservicios de [backend-delivery](https://github.com/gh0st1608/backend-delivery) (auth, shop, checkout, order y payment).

## Stack

| Área | Tecnología |
| --- | --- |
| Framework | Expo 54, React Native 0.81 (New Architecture), React 19, TypeScript 5.9 |
| Navegación | Expo Router 6 (rutas tipadas) |
| Estado | Zustand (`store/`), React Context para la sesión (`context/`) |
| HTTP | Axios con interceptores: access token, cabecera `X-Client-Type` y renovación de sesión ante un 401 |
| Sesión | Access token en memoria; refresh token en `expo-secure-store` (móvil) o cookie HttpOnly (web) |
| Tiempo real | Socket.IO client autenticado con el access token |
| Mapas | `react-native-maps` (nativo), Leaflet / `react-leaflet` (web), Google Geocoding y Directions, `@mapbox/polyline` |
| Pagos | PayPal a través de backend-payment |

## Requisitos

- Node.js 18 o superior y npm
- [Expo Go](https://expo.dev/go) en el dispositivo, o un emulador Android / simulador iOS
- El backend corriendo: ver [Conectar con el backend local](#conectar-con-el-backend-local)
- (Opcional) `eas-cli` para generar builds: `npm install -g eas-cli`

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz (está en `.gitignore`):

```env
EXPO_PUBLIC_API_URL_AUTH=http://<HOST>:8080/auth
EXPO_PUBLIC_API_URL_SHOP=http://<HOST>:8080/shop
EXPO_PUBLIC_API_URL_CHECKOUT=http://<HOST>:8080/checkout
EXPO_PUBLIC_API_URL_ORDER=http://<HOST>:8080/order
EXPO_PUBLIC_API_URL_PAYMENT=http://<HOST>:8080/payment
EXPO_PUBLIC_SOCKET_URL=http://<HOST>:3004
EXPO_PUBLIC_API_KEY_GOOGLE=<api key de Google>
EXPO_PUBLIC_API_URL_GOOGLE=https://maps.googleapis.com/maps/api
```

| Variable | Uso |
| --- | --- |
| `EXPO_PUBLIC_API_URL_AUTH` | backend-auth: login, registro, verificación de email, refresh y logout |
| `EXPO_PUBLIC_API_URL_SHOP` | backend-shop: productos y categorías |
| `EXPO_PUBLIC_API_URL_CHECKOUT` | backend-checkout: carrito del usuario (`/carts/me`) |
| `EXPO_PUBLIC_API_URL_ORDER` | backend-order: pedidos, tarifas (`/pricing`) y confirmación de entrega |
| `EXPO_PUBLIC_API_URL_PAYMENT` | backend-payment: creación y confirmación del pago en PayPal |
| `EXPO_PUBLIC_SOCKET_URL` | Servidor Socket.IO de backend-order (tracking en tiempo real) |
| `EXPO_PUBLIC_API_KEY_GOOGLE` | API key de Google (geocoding y rutas) |
| `EXPO_PUBLIC_API_URL_GOOGLE` | URL base de las APIs de Google Maps |

Cada URL incluye el prefijo del servicio, porque los servicios del front llaman rutas relativas (`/login`, `/carts/me`, `/pricing`, ...). Las variables se leen en [constants/config.ts](constants/config.ts) y en [api/socket/clients/socket.client.ts](api/socket/clients/socket.client.ts). Al cambiarlas, reinicia el bundler con `npx expo start -c`.

## Conectar con el backend local

El entorno de desarrollo del backend usa LocalStack (DynamoDB, EventBridge, SQS, SES) y un API Gateway local con nginx en el puerto `8080`. Ver la rama `infra` de backend-delivery (`infra-delivery/README.md`) y el README de la rama `gateway`.

`<HOST>` depende de dónde corre la app:

| Dónde corre la app | `<HOST>` |
| --- | --- |
| Web en el mismo equipo | `localhost` |
| Emulador Android | `10.0.2.2` |
| Simulador iOS | `localhost` |
| Dispositivo físico (Expo Go) | IP del equipo en la red local (p. ej. `192.168.1.20`), o la URL pública de ngrok |

Para web, el origen de la app (por ejemplo `http://localhost:8081`) debe estar en `CORS_ORIGINS` de cada servicio. Si no, el navegador bloquea las peticiones.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Abre la app en Android |
| `npm run ios` | Abre la app en iOS |
| `npm run web` | Abre la app en el navegador |
| `npm run lint` | Ejecuta ESLint (`eslint-config-expo`) |
| `npx tsc --noEmit` | Verifica los tipos de TypeScript |

## Estructura del proyecto

```
app/                    Rutas (Expo Router, basado en archivos)
├── index.tsx           Redirección según el estado de la sesión
├── auth/               Login, registro, recuperar contraseña (email → código → nueva contraseña)
├── onboarding/         Selección de categorías preferidas
├── (tabs)/             Home, búsqueda, favoritos, notificaciones y perfil (requiere sesión)
└── (stack)/            Producto, carrito, checkout, pago, tracking y ajustes
api/
├── http/
│   ├── clients/        Instancias de Axios por microservicio (y Google Maps)
│   ├── interceptors/   Token, X-Client-Type y renovación de sesión ante un 401
│   ├── services/       Llamadas a la API por dominio
│   ├── types/          Tipos de request/response
│   └── session.ts      Refresh (single-flight), guardado y revocación de la sesión
└── socket/             Cliente Socket.IO, canales y servicio de tracking
components/             Componentes de UI agrupados por pantalla
hooks/                  Lógica de cada pantalla (use-cart, use-checkout-flow, use-order-tracking, ...)
store/                  Stores de Zustand (carrito, checkout)
context/                AuthContext (estado de la sesión y acciones de autenticación)
constants/              Configuración y tema
utils/                  Tokens, eventos de sesión, moneda, manejo de errores, fases de tracking
mocks/                  Datos de prueba
assets/, public/        Imágenes, íconos y SVG
```

Los componentes con implementación distinta por plataforma usan los sufijos `.native.tsx` y `.web.tsx` (por ejemplo `components/tracking/map-route.*`); Metro elige el archivo correcto según la plataforma, y los archivos `.d.ts` le dan a TypeScript el contrato común.

## Sesión y seguridad

Sigue el modelo de sesión de backend-auth (tokens RS256 con refresh rotativo), según OWASP MASVS:

- **Access token**: vida corta y solo en memoria ([utils/token-storage.ts](utils/token-storage.ts)). El interceptor lo envía como `Authorization: Bearer <token>`.
- **Refresh token**:
  - **Móvil**: en el almacenamiento seguro del sistema (Keychain / Keystore) con `expo-secure-store`.
  - **Web**: en una cookie HttpOnly que gestiona el backend, de modo que JavaScript nunca lo ve. Por eso el cliente de auth usa `withCredentials`.
- **Cabecera `X-Client-Type`** (`web` | `mobile`): le indica al backend por dónde entregar el refresh token.
- **Renovación**: ante un `401`, [api/http/session.ts](api/http/session.ts) renueva la sesión **una sola vez**, aunque varias peticiones fallen al mismo tiempo, y reintenta la petición. El backend trata el reúso de un refresh token ya rotado como robo y revoca la sesión. Si la renovación falla, la sesión se cierra mediante [utils/session-events.ts](utils/session-events.ts).
- **Al abrir la app** la sesión se restaura con el refresh token. **Logout** revoca la sesión en el servidor.
- **El usuario nunca viaja en el body**: carrito, órdenes, pagos y preferencias se resuelven en el backend a partir del token.
- **Tracking**: el socket envía el access token en el handshake y solo permite seguir órdenes propias.

### Recuperar o definir la contraseña

`forgot-password` (email) → `verify-email` (código de 4 dígitos, se puede reenviar) → `create-new-password`. El backend vuelve a exigir el código al definir la contraseña. Las cuentas sin contraseña (`hasPassword = false`) pasan por este mismo flujo.

## Montos: CLP y USD

La app está orientada a Chile y muestra los montos en **pesos chilenos** ([utils/currency.ts](utils/currency.ts)).

- **Tarifa de envío y tipo de cambio** USD/CLP: vienen de `GET /order/pricing`, configurados en backend-order.
- **Cobro en USD**: PayPal no opera con CLP, así que el carrito y el checkout informan el monto **aproximado en USD** que se cobrará.
- **Montos definitivos**: los calcula el backend al crear la orden, a partir de los precios del catálogo y del tipo de cambio congelado en ese momento. El front envía solo `productId` y `quantity`, y nunca envía montos al crear el pago.

## Flujo de la app

1. **Sesión**: [app/index.tsx](app/index.tsx) redirige según el `AuthContext`: login, onboarding de categorías, definición de contraseña o home.
2. **Catálogo**: home con categorías y productos, búsqueda y favoritos. Desde el detalle o la búsqueda se agrega al carrito, respetando el stock.
3. **Carrito**: se guarda en backend-checkout (`/checkout/carts/me`) y se sincroniza al entrar a la app. No se pueden mezclar productos de distintas tiendas.
4. **Checkout**: se elige la dirección en el mapa (geocoding con Google), se crea la orden y luego el pago en PayPal. Por ahora PayPal es el único medio habilitado; los demás aparecen como "Próximamente".
5. **Pago**: las pantallas `payment/processing`, `success` y `failure` confirman el pago. El carrito se vacía **solo** cuando el pago se confirma; si falla o se cancela, el carrito sigue intacto.
6. **Tracking**: `tracking/[orderId]` y `tracking/order/[orderId]` se suscriben a `order.tracking.updated` y `order.courier.assigned`, muestran la ruta del repartidor y permiten **confirmar la entrega** (`PATCH /order/:id/confirm-delivery`).

Fases del tracking ([utils/tracking-phase.ts](utils/tracking-phase.ts)):

```
ASSIGNED → PREPARING → TO_PICKUP → PICKED_UP → ON_THE_WAY → TO_DROPOFF → DELIVERED
```

## Convención de la API

Los servicios envuelven el payload en `Data` y esperan respuestas con `Data` o `Error`:

```jsonc
// Request
{ "Data": { "Cart": { "productId": "...", "quantity": 1 } } }

// Respuesta OK
{ "Data": { /* ... */ } }

// Respuesta con error
{ "Error": { "title": "...", "message": "..." } }
```

[utils/error-handler.ts](utils/error-handler.ts) traduce los errores a un `Error` con el mensaje del backend, que las pantallas muestran al usuario.

## Build y despliegue

### Móvil (EAS)

Perfiles definidos en [eas.json](eas.json): `development`, `preview` y `production`.

```bash
eas login
eas build --profile preview --platform android
eas build --profile production --platform android
```

El package de Android es `com.solutionserj.foodstoresdc` ([app.config.js](app.config.js)).

Las variables `EXPO_PUBLIC_*` no se suben con el `.env`. Para los builds en EAS hay que definirlas como variables de entorno del proyecto en EAS o en el bloque `env` de cada perfil.

> ⚠️ El bloque `env` de `eas.json` define `API_URL`, que la app no usa (lee `EXPO_PUBLIC_*`) y que apunta a una API que ya no existe. Hay que reemplazarlo por las variables `EXPO_PUBLIC_*` cuando el backend se despliegue en AWS.

### Web

Para generar el build web en local:

```bash
npx expo export --platform web   # genera dist/
```

> ⚠️ Por ahora la web no tiene dónde desplegarse: el backend corre solo en local (LocalStack) y la infraestructura anterior en AWS se eliminó. Antes de reutilizar [buildspec.yml](buildspec.yml) hay que actualizar dos cosas:
> - el bucket `foodstore.solutionserj.com`, que ya no existe;
> - el ID de CloudFront `E1VD9H39FYQZIE`, que pertenece a otro proyecto (appointment-backend).

## Pendientes conocidos

- Los medios de pago con tarjeta, Apple Pay y Google Pay aún no están implementados.
- Las opciones de ajustes Language, FAQs, Privacy y Help no tienen pantalla (se muestran deshabilitadas).
- `utils/storage.ts` ya no se usa (lo reemplazó `utils/token-storage.ts`).

## Ramas

- `main`: rama principal
- `develop`: desarrollo
