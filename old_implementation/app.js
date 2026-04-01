// DOM Elements
const views = {
  brands: document.getElementById('view-brands'),
  categories: document.getElementById('view-categories'),
  products: document.getElementById('view-products')
};
const containers = {
  brands: document.getElementById('brands-container'),
  categories: document.getElementById('categories-container'),
  products: document.getElementById('products-grid')
};

const navControls = document.getElementById('nav-controls');
const btnBack = document.getElementById('btn-back');
const breadcrumb = document.getElementById('breadcrumb');
const categoryBrandTitle = document.getElementById('category-brand-title');
const productsTitle = document.getElementById('products-title');
const searchInput = document.getElementById('searchInput');
const logo = document.getElementById('logo');

// State Management
let state = {
  view: 'brands', // 'brands', 'categories', 'products', 'search'
  brand: null,
  category: null,
  searchQuery: ''
};

let cart = [];

// Data structuring
const brandsData = ['Canon', 'Sony', 'Nikon', 'MacBooks', 'Drones', 'iPhone'];
const categoriesData = ['Cameras', 'Lenses', 'IPAD', 'MACBOOK AIR', 'MACBOOK PRO', 'IMAC', 'MAC MINI', 'DJI', 'iPhone 17', 'iPhone 16', 'iPhone 15', 'iPhone Anteriores'];

// Navigation Core
function switchView(viewName) {
  // Hide all views
  Object.values(views).forEach(v => {
    v.classList.remove('active');
  });

  // Show target view
  const target = views[viewName] || views.products; // Search uses products view
  target.classList.add('active');
  
  state.view = viewName;
  updateNavControls();
}

function updateNavControls() {
  if (state.view === 'brands') {
    navControls.classList.add('hidden');
  } else {
    navControls.classList.remove('hidden');
    if (state.view === 'search') {
      breadcrumb.textContent = `Buscando: "${state.searchQuery}"`;
    } else if (state.view === 'categories') {
      breadcrumb.textContent = `${state.brand}`;
    } else if (state.view === 'products') {
      let displayCat;
      if (state.category === 'Cameras') displayCat = 'Cámaras';
      else if (state.category === 'Lenses') displayCat = 'Lentes';
      else displayCat = state.category;

      breadcrumb.textContent = `${state.brand} / ${displayCat}`;
    }
  }
}

function goBack() {
  if (state.view === 'search') {
    searchInput.value = '';
    state.searchQuery = '';
    // Regresa a la vista anterior o marcas
    if (state.category) {
      renderProductsView(state.brand, state.category);
    } else if (state.brand) {
      renderCategoriesView(state.brand);
    } else {
      renderBrandsView();
    }
  } else if (state.view === 'products') {
    renderCategoriesView(state.brand);
  } else if (state.view === 'categories') {
    renderBrandsView();
  }
}

// Renderers
function renderBrandsView() {
  state.brand = null;
  state.category = null;
  containers.brands.innerHTML = '';
  
  brandsData.forEach(brand => {
    const card = document.createElement('div');
    card.className = `huge-card ${brand.toLowerCase()}-card`;
    card.innerHTML = `<h3>${brand}</h3>`;
    card.onclick = () => renderCategoriesView(brand);
    containers.brands.appendChild(card);
  });
  
  switchView('brands');
}

function renderCategoriesView(brand) {
  state.brand = brand;
  categoryBrandTitle.textContent = brand;
  containers.categories.innerHTML = '';
  
  let cats;
  if (brand === 'MacBooks') {
    cats = [
      { id: 'IPAD', label: 'iPad' },
      { id: 'MACBOOK AIR', label: 'MacBook Air' },
      { id: 'MACBOOK PRO', label: 'MacBook Pro' },
      { id: 'IMAC', label: 'iMac' },
      { id: 'MAC MINI', label: 'Mac mini' }
    ];
  } else if (brand === 'Drones') {
    cats = [{ id: 'DJI', label: 'Modelos DJI' }];
  } else if (brand === 'iPhone') {
    cats = [
      { id: 'iPhone 17', label: 'iPhone 17 Series' },
      { id: 'iPhone 16', label: 'iPhone 16 Series' },
      { id: 'iPhone 15', label: 'iPhone 15 Series' },
      { id: 'iPhone Anteriores', label: 'Modelos Anteriores / CPO' }
    ];
  } else {
    cats = [{ id:'Cameras', label:'Cámaras' }, { id:'Lenses', label:'Lentes' }];
  }
  
  cats.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'huge-card';
    card.innerHTML = `<h3>${cat.label}</h3>`;
    card.onclick = () => renderProductsView(brand, cat.id);
    containers.categories.appendChild(card);
  });
  
  switchView('categories');
}

function renderProductsView(brand, category) {
  state.category = category;
  let displayCat;
  if (category === 'Cameras') displayCat = 'Cámaras';
  else if (category === 'Lenses') displayCat = 'Lentes';
  else displayCat = category;
  
  productsTitle.textContent = `${brand} - ${displayCat}`;
  
  // Filtrado estricto
  let filtered = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  
  // Agrupar lentes bajo la misma categoría visual
  if (category === 'Lenses') {
    filtered = filtered.filter(p => p.category.includes('Lenses'));
  } else {
    filtered = filtered.filter(p => p.category === category);
  }

  renderGrid(filtered);
  switchView('products');
}

function renderSearchView(query) {
  state.searchQuery = query;
  productsTitle.textContent = `Resultados de búsqueda`;
  
  const queryLower = query.toLowerCase();
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(queryLower) || 
    p.brand.toLowerCase().includes(queryLower)
  );
  
  renderGrid(filtered);
  switchView('search');
}

function renderGrid(items) {
  containers.products.innerHTML = '';
  if (items.length === 0) {
    containers.products.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:2rem;">No se encontraron productos.</p>';
    return;
  }
  
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card animate';
    
    const imageHtml = item.image 
        ? `<img src="${item.image}" alt="${item.name}" class="product-image">`
        : `<div class="product-image-placeholder">
             <svg viewBox="0 0 24 24" width="40" height="40" fill="var(--text-secondary)">
               <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
             </svg>
           </div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="product-name">${item.name}</div>
      <div class="product-price">USD ${item.price} <small>(${item.brand})</small></div>
      <button class="btn-buy" onclick="openModal('${item.id}')">Consultar</button>
    `;
    containers.products.appendChild(card);
  });
}

// Event Listeners
btnBack.addEventListener('click', goBack);
logo.addEventListener('click', () => {
    searchInput.value = '';
    renderBrandsView();
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (query.length > 0) {
    renderSearchView(query);
  } else {
    goBack(); // Will return to previous valid state
  }
});

// --- Modal Logic ---
let modalState = {
  product: null,
  selectedStorage: null,
  selectedColor: null
};

window.openModal = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  modalState.product = prod;
  
  if (prod.variants && prod.variants.length > 0) {
    modalState.selectedStorage = prod.variants[0].storage;
    modalState.selectedColor = prod.variants[0].colors[0];
  } else {
    modalState.selectedStorage = null;
    modalState.selectedColor = null;
  }
  
  renderModalBody();
  document.getElementById('product-modal').classList.remove('hidden');
  // slight delay to allow display:block before opacity transition
  setTimeout(() => document.getElementById('product-modal').classList.add('active'), 10);
}

window.closeModal = function() {
  document.getElementById('product-modal').classList.remove('active');
  setTimeout(() => document.getElementById('product-modal').classList.add('hidden'), 300);
}

document.getElementById('modal-close').addEventListener('click', closeModal);

window.selectStorage = function(storage) {
  modalState.selectedStorage = storage;
  const selectedVariant = modalState.product.variants.find(v => v.storage === storage);
  if (selectedVariant) {
      modalState.selectedColor = selectedVariant.colors[0];
  }
  renderModalBody();
}

window.selectColor = function(color) {
  modalState.selectedColor = color;
  renderModalBody();
}

function renderModalBody() {
  const body = document.getElementById('modal-body');
  const p = modalState.product;
  let price = p.price;
  let variantHtml = '';
  
  if (p.variants) {
    const selectedVariant = p.variants.find(v => v.storage === modalState.selectedStorage);
    if (selectedVariant) {
       price = selectedVariant.price;
       
       let storagePills = p.variants.map(v => 
         `<button class="pill ${v.storage === modalState.selectedStorage ? 'selected':''}" onclick="selectStorage('${v.storage}')">
             ${v.storage}
          </button>`
       ).join('');
       
       let colorPills = selectedVariant.colors.map(c => 
         `<button class="pill ${c === modalState.selectedColor ? 'selected':''}" onclick="selectColor('${c}')">
             ${c}
          </button>`
       ).join('');
       
       const conditionLabel = selectedVariant.condition ? `<div style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.9rem;">Condición: <b>${selectedVariant.condition}</b></div>` : '';

       variantHtml = `
          ${conditionLabel}
          <div class="variant-group">
            <div class="variant-title">Capacidad / Versión</div>
            <div class="pill-container">${storagePills}</div>
          </div>
          <div class="variant-group">
            <div class="variant-title">Color</div>
            <div class="pill-container">${colorPills}</div>
          </div>
       `;
    }
  }

  const imageHtml = p.image 
        ? `<img src="${p.image}" alt="${p.name}" class="product-image" style="height:140px; margin-bottom:1rem;">`
        : `<div class="product-image-placeholder" style="height:140px; margin-bottom:1rem;">
             <svg viewBox="0 0 24 24" width="40" height="40" fill="var(--text-secondary)">
               <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
             </svg>
           </div>`;

  body.innerHTML = `
    ${imageHtml}
    <h2 style="font-size: 1.6rem; font-weight:700; margin-bottom: 0.5rem; letter-spacing:-0.02em;">${p.name}</h2>
    ${variantHtml}
    <div class="modal-price">USD ${price}</div>
    <button onclick="addToCart()" style="border-radius:30px; font-weight:600; font-size:1.05rem; padding:1rem; border:none; color:white; background:var(--accent-color); transition:var(--transition); width:100%; display:flex; justify-content:center; align-items:center; gap:0.5rem; cursor:pointer; margin-top: 1rem;">
       Añadir al Carrito
    </button>
  `;
}

window.addToCart = function() {
  const p = modalState.product;
  let price = p.price;
  let details = '';
  
  if (p.variants) {
     const v = p.variants.find(vx => vx.storage === modalState.selectedStorage);
     if (v) price = v.price;
     details = `${modalState.selectedStorage} | Color: ${modalState.selectedColor}`;
  }
  
  cart.push({
    id: p.id,
    name: p.name,
    details: details,
    price: price
  });
  
  closeModal();
  updateCartBadge();
  toggleCart(); // Auto-open cart to show user their addition
}

window.toggleCart = function() {
  const overlay = document.getElementById('cart-overlay');
  const sidebar = document.getElementById('cart-sidebar');
  const isActive = overlay.classList.contains('active');
  
  if (isActive) {
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
  } else {
    renderCart();
    overlay.classList.add('active');
    sidebar.classList.add('active');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  badge.textContent = cart.length;
  if(cart.length > 0) {
      badge.classList.remove('hidden');
  } else {
      badge.classList.add('hidden');
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('cart-total-price');
  
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Tu bolsa está vacía.</div>';
    totalPriceEl.textContent = 'USD 0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-details">${item.details}</div>
        <div class="cart-item-price">USD ${item.price}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})">Eliminar</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  totalPriceEl.textContent = `USD ${total}`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCart();
}

function generateOrderText() {
  let text = 'Hola ispotcba, quisiera realizar el siguiente pedido:\n\n';
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price;
    text += `${index + 1}. ${item.name}`;
    if(item.details) text += `\n   ${item.details}`;
    text += `\n   Precio: USD ${item.price}\n\n`;
  });
  
  text += `💵 Total Estimado: USD ${total}\n`;
  text += `¿Tienen disponibilidad?`;
  return text;
}

window.checkoutWhatsApp = function() {
  if (cart.length === 0) return;
  const text = encodeURIComponent(generateOrderText());
  window.open(`https://wa.me/5493517669886?text=${text}`, '_blank');
}

window.checkoutEmail = function() {
  if (cart.length === 0) return;
  const body = encodeURIComponent(generateOrderText());
  const subject = encodeURIComponent('Nuevo Pedido - ISPOT IMPORT');
  window.location.href = `mailto:ispotcba@gmail.com?subject=${subject}&body=${body}`;
}

// Initialize
renderBrandsView();
