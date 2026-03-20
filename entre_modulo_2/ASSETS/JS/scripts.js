// Inicializar AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Productos
const productos = [
    {
        id: 1,
        nombre: "Nave X-1 Interceptor",
        precio: 299900,
        imagen: "https://via.placeholder.com/300x200/58a6ff/ffffff?text=X-1",
        descripcion: "Nave ligera para misiones rápidas. Velocidad máxima: 0.9c"
    },
    {
        id: 2,
        nombre: "Crucero Nova Prime",
        precio: 1250000,
        imagen: "https://via.placeholder.com/300x200/79c0ff/000000?text=Nova+Prime",
        descripcion: "Nave familiar con capacidad para 12 tripulantes. Ideal para colonización."
    },
    {
        id: 3,
        nombre: "Destructor Orion",
        precio: 4500000,
        imagen: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Orion",
        descripcion: "Potencia de fuego impresionante. Perfecta para defensa planetaria."
    },
    {
        id: 4,
        nombre: "Explorador Zeta",
        precio: 850000,
        imagen: "https://via.placeholder.com/300x200/51cf66/ffffff?text=Zeta",
        descripcion: "Diseñada para exploración profunda. Sensores de última generación."
    }
];

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Render productos (solo si existe #productos-container, es decir en index.html)
function renderizarProductos() {
    const container = $('#productos-container');
    if (!container.length) return;

    container.empty();
    productos.forEach(producto => {
        const card = `
            <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${producto.id * 100}">
                <article class="card product-card h-100 text-center">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}"
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="text-success fw-bold fs-4 mb-3">$${producto.precio.toLocaleString()}</p>
                        <button class="btn btn-primary w-100 agregar-carrito" data-id="${producto.id}">
                            Agregar al Carrito 🚀
                        </button>
                    </div>
                </article>
            </div>
        `;
        container.append(card);
    });
}

// Dropdown navbar
function renderizarDropdownCarrito() {
    const container = $('#dropdown-carrito');
    if (!container.length) return;

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (totalItems === 0) {
        container.html(`
            <li>
                <div class="dropdown-item text-center py-3">
                    <h6 class="text-muted mb-1">Carrito vacío</h6>
                    <p class="mb-0 small">¡Añade productos!</p>
                </div>
            </li>
        `);
        return;
    }

    let html = `
        <li class="dropdown-header">
            <div class="d-flex justify-content-between align-items-center">
                <span>Tu carrito</span>
                <span class="badge bg-primary">${totalItems}</span>
            </div>
        </li>
    `;
    
    carrito.forEach(item => {
        html += `
            <li>
                <div class="dropdown-item p-2">
                    <div class="row align-items-center g-2">
                        <div class="col-3">
                            <img src="${item.imagen}" class="img-fluid rounded"
                                 style="width: 50px; height: 40px; object-fit: cover;">
                        </div>
                        <div class="col-6">
                            <h6 class="mb-0 small">${item.nombre}</h6>
                            <small class="text-success">$${item.precio.toLocaleString()}</small>
                        </div>
                        <div class="col-3 text-end">
                            <span class="badge bg-primary small">${item.cantidad}</span>
                        </div>
                    </div>
                </div>
            </li>
        `;
    });
    
    html += `
        <li><hr class="dropdown-divider"></li>
        <li>
            <div class="dropdown-item text-end p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <span>Total:</span>
                    <strong>$${totalPrecio.toLocaleString()}</strong>
                </div>
            </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
            <a class="dropdown-item text-center py-2" href="carrito.html">
                <strong>Ver carrito completo →</strong>
            </a>
        </li>
    `;
    
    container.html(html);
}

// Contador badge
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    $('#cart-count')
        .text(totalItems)
        .toggleClass('animate__pulse', totalItems > 0);
}

// Carrito completo (solo si existe #carrito-container, es decir en carrito.html)
function renderizarCarrito() {
    const container = $('#carrito-container');
    if (!container.length) return;

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (carrito.length === 0) {
        container.html(`
            <div class="text-center py-5">
                <div class="animate__animated animate__bounceIn">
                    <h5 class="text-muted">Tu carrito está vacío</h5>
                    <p>¡Añade productos desde la página de productos!</p>
                </div>
            </div>
        `);
        $('#total-price').text('0');
        return;
    }

    let html = '<div class="row g-3">';
    carrito.forEach(item => {
        html += `
            <div class="col-12">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-3">
                                <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}">
                            </div>
                            <div class="col-6">
                                <h6>${item.nombre}</h6>
                                <p>$${item.precio.toLocaleString()}</p>
                            </div>
                            <div class="col-3 text-end">
                                <div class="input-group input-group-sm">
                                    <button class="btn btn-outline-secondary decrementar" data-id="${item.id}">-</button>
                                    <input type="number" class="form-control text-center" value="${item.cantidad}" readonly>
                                    <button class="btn btn-outline-secondary incrementar" data-id="${item.id}">+</button>
                                </div>
                                <button class="btn btn-sm btn-outline-danger mt-1 eliminar-item" data-id="${item.id}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.html(html);
    $('#total-price').text(total.toLocaleString());
}

// Eventos
$(document).ready(function() {
    // Scroll suave solo cuando el href es ancla en la misma página
    $('a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = $(href);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        }
    });

    // Render inicial
    renderizarProductos();
    actualizarContadorCarrito();
    renderizarDropdownCarrito();
    renderizarCarrito();

    // Agregar al carrito
    $(document).on('click', '.agregar-carrito', function() {
        const id = parseInt($(this).data('id'));
        const producto = productos.find(p => p.id === id);
        
        const itemExistente = carrito.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        renderizarDropdownCarrito();
        renderizarCarrito();
        
        $(this)
            .addClass('animate__animated animate__tada')
            .delay(500)
            .queue(function() {
                $(this).removeClass('animate__tada').dequeue();
            });
    });

    // Incrementar
    $(document).on('click', '.incrementar', function() {
        const id = parseInt($(this).data('id'));
        const item = carrito.find(item => item.id === id);
        if (item) item.cantidad++;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        renderizarDropdownCarrito();
        actualizarContadorCarrito();
    });

    // Decrementar
    $(document).on('click', '.decrementar', function() {
        const id = parseInt($(this).data('id'));
        const item = carrito.find(item => item.id === id);
        if (item) {
            item.cantidad--;
            if (item.cantidad <= 0) {
                carrito = carrito.filter(i => i.id !== id);
            }
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        renderizarDropdownCarrito();
        actualizarContadorCarrito();
    });

    // Eliminar
    $(document).on('click', '.eliminar-item', function() {
        const id = parseInt($(this).data('id'));
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        renderizarDropdownCarrito();
        actualizarContadorCarrito();
    });

    // Vaciar (solo existe en carrito.html)
    $('#vaciar-carrito').on('click', function() {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        renderizarDropdownCarrito();
        actualizarContadorCarrito();
    });
});
