//scroll suave boton arriba
const btnIrArriba = document.getElementById('btn-ir-arriba'); //guardo en una variable el ID del boton

if (btnIrArriba) { //Si el boton existe, se agrega un evento si se hace click en el boton
    btnIrArriba.addEventListener('click', () => {
        window.scrollTo({ //la ventana hace scroll hacia la posicion 0,0 de manera suave
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
}
