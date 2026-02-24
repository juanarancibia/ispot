# ISpot — Guía de Configuración Manual

Este instructivo cubre todos los pasos manuales necesarios para llevar el proyecto a producción: bot de Telegram, base de datos Redis en Vercel, deploy y activación del webhook.

---

## PASO 1: Crear el Bot de Telegram

1. Abrí Telegram y buscá el usuario **@BotFather**.
2. Iniciá una conversación y enviá el comando:
   ```
   /newbot
   ```
3. BotFather te va a pedir:
   - **Nombre del bot** (ej: `ISpot Stock`): es el nombre visible para los usuarios.
   - **Username del bot** (ej: `ispot_stock_bot`): debe terminar en `bot`, sin espacios.
4. Al finalizar, BotFather te envía un mensaje con el **token de acceso** del bot. Se ve así:
   ```
   7123456789:AAHxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
   ```
   > ⚠️ **Guardá este token**, lo vas a necesitar como `TELEGRAM_BOT_TOKEN`.

5. Opcionalmente, personalizá el bot con `/setdescription`, `/setuserpic` y `/setabouttext` desde BotFather.

---

## PASO 2: Crear una cuenta en Vercel y preparar el repositorio

### 2.1 — Subir el código a GitHub

1. Creá un repositorio **privado** en [github.com](https://github.com/new).
2. Desde la carpeta del proyecto en tu terminal, ejecutá:
   ```bash
   git init
   git add .
   git commit -m "feat: ISpot MVP inicial"
   git remote add origin https://github.com/TU_USUARIO/ispot.git
   git push -u origin main
   ```

### 2.2 — Crear cuenta en Vercel

1. Entrá a [vercel.com](https://vercel.com) y hacé clic en **Sign Up**.
2. Elegí **Continue with GitHub** y autorizá el acceso.

---

## PASO 3: Configurar Redis con Upstash en Vercel

> Vercel deprecó su propio KV storage y migró a **Upstash Redis**. El código del proyecto usa `@vercel/kv` que es 100% compatible con Upstash.

### 3.1 — Crear la base de datos Upstash

1. En el dashboard de Vercel, andá a la sección **Storage** en el menú lateral.
2. Hacé clic en **Create Database** → seleccioná **Upstash Redis**.
3. Completá:
   - **Name**: `ispot-redis` (o el que prefieras)
   - **Region**: elegí la más cercana a tus usuarios (ej: `us-east-1` o `sa-east-1`)
   - **Plan**: `Hobby` (gratis, 10k requests/mes) es suficiente para el MVP
4. Hacé clic en **Create**.

### 3.2 — Conectar la base de datos al proyecto

> Hacé esto **después** de crear el proyecto en Vercel (Paso 4). Podés volver acá luego.

1. En la base de datos recién creada, hacé clic en **Connect Project**.
2. Seleccioná tu proyecto `ispot` de la lista.
3. Vercel agrega automáticamente las siguientes variables de entorno al proyecto:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

---

## PASO 4: Deploy en Vercel

### 4.1 — Importar el proyecto

1. En el dashboard de Vercel, hacé clic en **Add New → Project**.
2. Buscá y seleccioná el repositorio `ispot` que subiste a GitHub.
3. Vercel detecta automáticamente que es un proyecto **Next.js**. No cambies nada en Framework Preset.
4. Expandí la sección **Environment Variables** antes de hacer el deploy.

### 4.2 — Configurar las variables de entorno

Agregá cada variable haciendo clic en **Add** por cada una:

| Variable | Valor |
|---|---|
| `OPENAI_API_KEY` | Tu API key de [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `TELEGRAM_BOT_TOKEN` | El token que te dio BotFather en el Paso 1 |
| `TELEGRAM_WEBHOOK_SECRET` | Una contraseña aleatoria que vos inventás (ej: `mi-secreto-seguro-2024`) |
| `ADMIN_PASSWORD` | La contraseña para entrar al panel `/admin` (ej: `admin-ispot-2024`) |

> Las variables de KV (`KV_URL`, etc.) las agrega Vercel automáticamente al conectar Upstash (Paso 3).

### 4.3 — Hacer el deploy

1. Hacé clic en **Deploy**.
2. Esperá 1-2 minutos mientras Vercel construye el proyecto.
3. Al finalizar, Vercel te muestra la URL de producción, por ejemplo:
   ```
   https://ispot-abc123.vercel.app
   ```
   > 📝 **Anotá esta URL**, la necesitás para el paso siguiente.

---

## PASO 5: Activar el Webhook de Telegram

Una vez que el deploy está up, necesitás decirle a Telegram que envíe los mensajes del bot a tu servidor.

Ejecutá este comando en tu terminal, reemplazando los valores:

```bash
curl -X POST "https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://<TU_DOMINIO_VERCEL>/api/webhook/telegram?secret=<TU_TELEGRAM_WEBHOOK_SECRET>"
```

**Ejemplo con valores reales:**
```bash
curl -X POST "https://api.telegram.org/bot7123456789:AAHxxxx/setWebhook" \
  -d "url=https://ispot-abc123.vercel.app/api/webhook/telegram?secret=mi-secreto-seguro-2024"
```

Si todo salió bien, Telegram responde:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

### Verificar que el webhook está activo

```bash
curl "https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/getWebhookInfo"
```

---

## PASO 6: Configuración inicial del negocio

1. Abrí la URL de tu tienda con `/admin` al final:
   ```
   https://ispot-abc123.vercel.app/admin
   ```
2. El navegador te pide usuario y contraseña (HTTP Basic Auth):
   - **Usuario**: cualquier texto (se ignora)
   - **Contraseña**: el valor que pusiste en `ADMIN_PASSWORD`
3. Completá el formulario con:
   - **Cotización USD**: el valor del dólar hoy
   - **Margen Proveedor 1**: ej `1.15` para un 15% de ganancia
   - **Margen Proveedor 2**: ej `1.20` para un 20% de ganancia
   - **WhatsApp Vendedor**: tu número con código de país, sin `+` ni espacios (ej: `5491123456789`)
4. Hacé clic en **Guardar Configuración**.

---

## PASO 7: Probar el flujo completo

1. Abrí Telegram y escribile al bot que creaste en el Paso 1.
2. Enviá un mensaje que empiece con `/prov1` (o que contenga "Cotización del momento") seguido de una lista de productos. Ejemplo:
   ```
   /prov1
   iPhone 15 Pro 128GB Black $950
   iPhone 15 Pro 256GB Blue $1050
   Samsung Galaxy S24 8GB 256GB $700
   ```
3. El bot debería responder:
   ```
   ✅ Stock actualizado: 3 productos insertados para Proveedor 1.
   ```
4. Entrá a tu tienda (`https://ispot-abc123.vercel.app`) y verificá que los productos aparecen con sus precios en ARS.
5. Agregá productos al carrito, abrí el carrito y hacé clic en **Hacer Pedido por WhatsApp** para probar el checkout.

---

## PASO 8 (Opcional): Dominio personalizado

1. En Vercel, andá a tu proyecto → **Settings → Domains**.
2. Hacé clic en **Add** e ingresá tu dominio (ej: `ispot.com.ar`).
3. Vercel te da los registros DNS que tenés que agregar en tu registrador de dominios (Nic.ar, GoDaddy, etc.).
4. Una vez propagado el DNS (puede tardar hasta 24hs), actualizá el webhook de Telegram con el nuevo dominio:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://ispot.com.ar/api/webhook/telegram?secret=<SECRET>"
   ```

---

## Resumen de Variables de Entorno

| Variable | Dónde obtenerla |
|---|---|
| `KV_URL` | Automático al conectar Upstash en Vercel |
| `KV_REST_API_URL` | Automático al conectar Upstash en Vercel |
| `KV_REST_API_TOKEN` | Automático al conectar Upstash en Vercel |
| `KV_REST_API_READ_ONLY_TOKEN` | Automático al conectar Upstash en Vercel |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `TELEGRAM_BOT_TOKEN` | BotFather en Telegram |
| `TELEGRAM_WEBHOOK_SECRET` | Lo inventás vos (string aleatorio largo) |
| `ADMIN_PASSWORD` | Lo inventás vos |

---

## Troubleshooting

### El bot no responde
- Verificá que el webhook esté activo con `getWebhookInfo`.
- Revisá los **Function Logs** en Vercel (dashboard → tu proyecto → Logs).

### Error "Unauthorized" en el webhook
- El `secret` en la URL del webhook debe coincidir exactamente con `TELEGRAM_WEBHOOK_SECRET`.

### El precio no se actualiza en la tienda
- La página principal es dinámica pero puede estar cacheada. Forzá un refresco con `Ctrl+Shift+R`.
- Verificá que el bot respondió con éxito al parsear la lista.

### La página `/admin` no pide contraseña
- Asegurate de que el `proxy.ts` esté en `src/proxy.ts` y que `ADMIN_PASSWORD` esté configurada en las variables de entorno de Vercel.
