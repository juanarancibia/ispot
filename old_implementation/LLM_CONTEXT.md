# Contexto del Proyecto: ISPOT IMPORT (Para LLMs)

Este archivo consolida y documenta todo el trabajo, decisiones de diseño, estructuras de datos y lógica de la plataforma **ISPOT IMPORT** para facilitar la continuidad del proyecto por parte de otro LLM o desarrollador.

## 1. Visión y Requerimientos Generales
El objetivo central del proyecto fue rediseñar un sitio de importaciones de tecnología (Cámaras, Lentes, Drones y dispositivos Apple) elevando notoriamente su estética. Buscamos una apariencia sumamente moderna y "premium", adoptando las guías de diseño de Apple (Dark Mode, Glassmorphism, jerarquía tipográfica limpia, transiciones suaves y minimalismo) sin necesidad de frameworks de JavaScript pesados. 

El modelo de negocio no requiere pasarela de pago (checkout web). Toda culminación del flujo de "Carrito" deriva hacia dos canales directos: WhatsApp e Email. Al comprar, los usuarios lo hacen en base a Dólares, y el carrito advierte que en caso de pagar en Pesos Argentinos se usa el Dólar Blue del día.

---

## 2. Arquitectura del Código
El proyecto es una **SPA (Single Page Application)** nativa construida estrictamente con:
- `index.html`: Estructura semántica base.
- `styles.css`: CSS puro (Vanilla), utilizando variables CSS nativas, Grid y Flexbox.
- `app.js`: Toda la lógica de negocio, manejo de estados de la interfaz, modal y carrito.
- `products.js`: Base de datos simulada en formato JSON/Array.

### 2.1 Ecosistema de Archivos
* **HTML (`index.html`)**: 
  - Contiene la Navbar fija con buscador, logo, badge de ubicación en CBA-ARG, e ícono de carrito (con un badge oculto/visible de cantidades).
  - Define `nav-controls` para flecha de retroceso.
  - Contenedor dinámico (etiqueta `<main>`) dividido lógicamente por `<div class="view">`:
    - `#view-brands`: Home default. Grilla global.
    - `#view-categories`: Segunda pantalla (ej. Cámaras / Lentes).
    - `#view-products`: Grilla de filtrado riguroso de items.
  - Carrito deslizable (Sidebar) `#cart-sidebar`.
  - `#product-modal` renderiza detalles de selección de compra.

* **Hoja de Estilos (`styles.css`)**: 
  - **Paleta y variables**: `--bg-color: #000000`, textos contrastados `#f5f5f7` y `#86868b`, con acentos en azul Apple `--accent-color: #2997ff`.
  - **Diseño fluido**: Transiciones definidas en un cubic-bezier suave `cubic-bezier(0.25, 1, 0.5, 1)`.
  - **Tarjetas Base**: `background: rgba(255, 255, 255, 0.03)`, border translúcido. En `hover` se aplican elevaciones sutiles y boxShadow expansivos.
  - **Personalización de Home**: Las `.huge-card` de cada marca tienen acentos lumínicos de fondo con CSS gradients según el brand color (ej. rojo para Canon, naranja para Sony).
  - **Glassmorphism**: Abundante uso de `backdrop-filter: blur(20px)`.

---

## 3. Lógica y Procesos (`app.js`)

La aplicación maneja un árbol de decisión del usuario para nunca asfixiarlo cognitivamente con cientos de items mezclados.

### Flujo de Navegación del Usuario (State Management)
1. Estado global del router manual: `let state = { view: 'brands', brand: null, category: null, searchQuery: '' }`
2. El usuario entra e invoca `renderBrandsView()`.
3. Al hacer clic en un "Brand" -> Pasa a `renderCategoriesView(brand)`. Internamente, mapea dinámicamente las categorías asociadas al prop de la marca clickeada (ej: Si marca="iPhone", categories=["17 series", "16 series", etc.]).
4. Clic en "Categoría" -> `renderProductsView(brand, category)` inyecta cards de producto filtradas.
5. El Navbar de búsqueda global interviene con `renderSearchView(query)`. Filtra la base de datos completa.

### Motor de Selección y Modal (`openModal` y renderizado)
El Modal (`#product-modal`) captura un ID único y renderiza no sólo el HTML del producto, sino toda la bifurcación lógica si este producto tiene el array `variants`:
- Guarda un `modalState` transitorio.
- Crea Botones de Tipo *Pill* interactivas para elegir las ramificaciones lógicas (ej. Storage / Color), marcando su estado como `.selected`.
- Modifica el precio transitorio dinámicamente cada vez que se clickea una capacidad / storage distinto (inyectando `selectStorage()` o `selectColor()`).

### Manipulación de Carrito (`addToCart`, `renderCart`)
Al accionar el *addToCart*, el sistema construye un string `details` ("256GB | Color: Blue") y lo pushea a un array global `let cart = []`. Luego invoca un `toggleCart()` animado abriendo la barra lateral y actualizando subtotal y render template iterativo por item.

### Gateway del Cierre de Venta (Format & Export)
En `checkoutWhatsApp()` y `checkoutEmail()`, el carrito completo entra un `generateOrderText()`. Construimos manualmente un string descriptivo: numeración del array, descripción de su nombre, capacidad, color y precio individual. Por último tabula el "Total Estimado: USD XXX" y redirige mendiante las API URIs `wa.me` y `mailto`.

---

## 4. Estructura de Datos Base (`products.js`)

Se ha consolidado y tipado estrictamente el formato para cualquier expansión en el futuro:

Para productos rígidos sin versiones (cámaras o lentes generalistas):
```javascript
{ 
  id: 'c1', 
  brand: 'Canon', 
  category: 'Cameras', 
  name: 'POWERSHOT G7 X MARK III', 
  price: 1820 
}
```

Para productos con múltiples variables combinadas de Precio + Almacenamiento + Color (MacBooks, iPhones):
```javascript
{ 
  id: 'ip17pm', 
  brand: 'iPhone', 
  category: 'iPhone 17', 
  name: 'iPhone 17 Pro Max', 
  price: 1470, // Base fallback price
  variants: [
    { 
      storage: '256GB', 
      price: 1510, 
      condition: 'Nuevo', 
      colors: ['Silver ⚪️'] 
    },
    { 
      storage: '512GB', 
      price: 1720, 
      condition: 'Nuevo', 
      colors: ['Silver ⚪️', 'Blue 🔵'] 
    }
  ]
}
```

---

## 5. Próximos Pasos (To-Do para el futuro LLM asignado)
Si se desea expandir las funcionales de este e-commerce Vanilla, estas son las instrucciones más naturales:

1. **Gestor de Imágenes**: Asignar URLs reales o subidas en el servidor como la propiedad `image: 'img.png'` a todos los productos del array. Si no existe se muestra el diseño placeholder estético de forma nativa.
2. **Local Storage Session**: Guardar el objeto o JSON del `cart` en localStorage para evitar vaciarlo en cada f5 de la ventana.
3. **Escalar al Dominio Framework**: Para un nivel Enterprise, todo el Vanilla DOM routing se podría portar a React.js, React Router o Next.js mapeando `.map()` sobre los arrays y encapsulando lógicas del Modals. Todo el CSS es agnóstico por lo que puede pasarse directo a `index.css` global en React. 

> Puedes proveer este archivo `.md` directo a la ventana de contexto de cualquier IA o LLM para que analice instántaneamente la semántica, reglas UI y datos del E-commerce.
