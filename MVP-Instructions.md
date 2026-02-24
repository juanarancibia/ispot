Documento de Especificaciones Técnicas (MVP - Importador de Tecnología)

🎯 Objetivo del Proyecto

Sos un Senior Software Engineer experto en Next.js (App Router), TypeScript, Tailwind CSS, y el ecosistema de Vercel (Vercel KV, Vercel AI SDK). Tu objetivo es construir un MVP funcional desde cero para un sistema de gestión de stock y e-commerce simplificado.

El negocio es de un importador que recibe listas de precios diariamente por WhatsApp de dos proveedores distintos, les aplica un margen de ganancia (markup) y los publica para que sus clientes le hagan pedidos mediante un link autogenerado de WhatsApp.

🛠️ Stack Tecnológico

Framework: Next.js 14+ (App Router)

Lenguaje: TypeScript

Estilos: Tailwind CSS + shadcn/ui (para componentes rápidos: Cards, Buttons, Inputs, Tables)

Base de Datos: Vercel KV (Redis serverless). No usaremos bases relacionales.

IA / Parsing: OpenAI API (gpt-4o-mini o similar) vía Vercel AI SDK o fetch nativo para extraer JSON estructurado de textos libres.

Ingesta: Telegram Bot API (Webhooks).

Manejo de Estado (Carrito): Zustand o React Context (Local Storage).

🗄️ Modelo de Datos (Vercel KV)

El sistema es efímero. El stock del día pisa al del día anterior. Todo se guarda en Redis (Vercel KV).

1. Clave: config_negocio (Tipo: JSON / Hash)

interface ConfigNegocio {
  cotizacion_usd: number; // Ej: 1450
  margen_prov_1: number;  // Ej: 1.15 (15% de ganancia)
  margen_prov_2: number;  // Ej: 1.20 (20% de ganancia)
  whatsapp_vendedor: string; // Ej: "5491123456789"
}


2. Claves: stock:prov_1 y stock:prov_2 (Tipo: Array de JSON)

interface Producto {
  id: string; // Generado al insertar (UUID o timestamp)
  marca: string;
  modelo: string;
  variantes: string[]; // Ej: ["Blue", "Silver"]
  precio_usd: number;
  precio_ars: number | null;
  condicion: "Nuevo" | "Usado" | "CPO" | "AS IS";
  proveedor: "prov_1" | "prov_2"; // Para saber qué margen aplicarle luego
}


🚀 Tareas de Implementación (Paso a Paso)

PASO 1: Estructura y Dependencias

Inicializar Next.js con Tailwind y TypeScript.

Instalar dependencias: @vercel/kv, ai, @ai-sdk/openai, lucide-react, zustand (opcional, para carrito).

Definir el archivo .env.example con:

KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN

OPENAI_API_KEY

TELEGRAM_BOT_TOKEN

TELEGRAM_WEBHOOK_SECRET

ADMIN_PASSWORD (Para proteger la ruta /admin).

PASO 2: Ingesta de Datos (Backend - Telegram Webhook)

Crear el endpoint POST /api/webhook/telegram/route.ts.

Seguridad: Verificar que la petición sea legítima (comparar un token en el path o header).

Lógica de Ruteo: - Leer el mensaje entrante req.body.message.text.

Determinar el proveedor. Regla simple: Si el texto contiene el comando /prov1 al inicio o la frase "Cotización del momento", es Proveedor 1. Si tiene /prov2 o "LISTA DE PRECIOS ACTUALIZADA", es Proveedor 2.

Llamada al LLM: Enviar el texto crudo a OpenAI solicitando un JSON estricto usando el siguiente System Prompt:

Eres un sistema automatizado de extracción de datos para un e-commerce. Tu tarea es recibir un texto crudo de un mensaje de WhatsApp de proveedores de tecnología y devolver ÚNICAMENTE un objeto JSON válido con la clave "productos" que contenga un arreglo de objetos.

Reglas de extracción:

Ignora saludos, reglas de garantía, cotizaciones de monedas o información general.

Esquema esperado por producto:
{
"marca": "String (Ej: Apple, Samsung. Infierela si no está explícita)",
"modelo": "String (Ej: iPhone 15 Pro 128GB. Completa nombres abreviados como '14 128gb' a 'iPhone 14 128GB' por contexto)",
"variantes": ["String"] (Array de colores o características extra, ej: ["Blue", "Silver"]),
"precio_usd": Number (Precio en dólares como entero),
"precio_ars": Number | null (Precio en pesos argentinos si existe, null si no),
"condicion": "String ('Nuevo', 'Usado', 'CPO', 'AS IS'. Por defecto 'Nuevo')"
}

No agregues markdown (como ```json) al inicio o final. Responde solo con JSON puro.

Almacenamiento: Una vez parseado el JSON, inyectar el ID autogenerado y el campo proveedor a cada objeto. Luego guardar en KV: await kv.set('stock:prov_1', JSON.stringify(productosParseados)).

Respuesta: Enviar un mensaje de vuelta a Telegram vía API confirmando: "✅ Stock actualizado: X productos insertados para el Proveedor Y."

PASO 3: Panel de Administración (/admin)

Crear una ruta protegida (puede ser un middleware simple chequeando una cookie o un HTTP Basic Auth básico con el ADMIN_PASSWORD).

UI de Configuración: Un formulario que haga GET a /api/config para leer config_negocio y permita editar y hacer POST para guardar: Cotización USD, Margen Prov 1, Margen Prov 2, y Número de WhatsApp.

UI de Stock: Dos tablas simples (una por proveedor) que listen el contenido actual de stock:prov_1 y stock:prov_2 leyendo directamente de KV.

PASO 4: Catálogo Frontend (Página Principal /)

Data Fetching: Servidor de Next.js lee de KV: config_negocio, stock:prov_1 y stock:prov_2. Combina ambos arrays de stock en uno solo.

Cálculo de Precios en Vivo: Antes de pasar los datos al cliente, calcular el precio_final_ars para cada producto:

// Lógica pseudocódigo:
const margen = producto.proveedor === 'prov_1' ? config.margen_prov_1 : config.margen_prov_2;
const precioBaseArs = producto.precio_ars !== null ? producto.precio_ars : (producto.precio_usd * config.cotizacion_usd);
const precioFinalArs = Math.round(precioBaseArs * margen);


UI del Cliente: Mostrar un layout responsivo (Grid). Cada tarjeta de producto muestra: Marca, Modelo, Condición, un selector (dropdown o badges) para las Variantes (colores), el Precio Final (formateado en ARS) y un botón "Agregar al Carrito".

PASO 5: Carrito y Checkout por WhatsApp

Implementar un slide-over (Sheet) o Modal para el carrito de compras persistido en Local Storage.

Al abrir el carrito, mostrar los ítems, cantidades, y el total de la compra en ARS.

Acción "Hacer Pedido": Al hacer clic, generar un mensaje de texto formateado con encodeURIComponent y redirigir al usuario:

const textoResumen = `Hola, quiero realizar el siguiente pedido:
- 1x Apple iPhone 15 Pro (Blue) - $ 1.500.000
- 1x JBL Flip 7 (Black) - $ 200.000
Total: $ 1.700.000`;

window.open(`https://wa.me/${config.whatsapp_vendedor}?text=${encodeURIComponent(textoResumen)}`, '_blank');


🔧 Scripts Útiles y Notas Finales

Configuración del Webhook de Telegram

Una vez que la app esté deployada en Vercel, el administrador deberá ejecutar este comando en su terminal para conectar el bot con el endpoint (esto no lo tenés que codear, pero tenelo en cuenta para la arquitectura):

curl -F "url=https://<TU_DOMINIO_VERCEL>/api/webhook/telegram?secret=<TU_TELEGRAM_WEBHOOK_SECRET>" https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook


Instrucción Final para el Agente IA: Crea los directorios, archivos, componentes, utils de formateo (moneda local) y la integración con la base de datos de manera modular, limpia y completamente tipada en TypeScript. Genera el código completo listo para ejecutar npm run dev y hacer el deploy a Vercel sin errores.