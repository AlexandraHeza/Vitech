const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

// Mostrar la primera imagen
slides[currentIndex].classList.add('active');

// Detectar scroll y cambiar imagen
window.addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    // Scroll hacia abajo → siguiente imagen
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  } else {
    // Scroll hacia arriba → imagen anterior
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
  }
});

// Función para cargar imágenes desde JSON
async function loadImagesFromJSON() {
    try {
        // Si tienes el archivo images.json en tu servidor
        const response = await fetch('images.json');
        const data = await response.json();
        
        // Extraer las URLs del JSON
        const imageUrls = data.carousel_images.map(img => img.url);
        
        // Reemplazar el array bgImages con estas URLs
        return imageUrls;
    } catch (error) {
        console.error('Error cargando JSON, usando imágenes por defecto', error);
        return bgImages; // array de respaldo
    }
}

// Modificar initCarousel para usar JSON
async function initCarouselWithJSON() {
    const imageUrls = await loadImagesFromJSON();
    carouselContainer.innerHTML = '';
    slides = [];
    
    // Aleatorizar si está configurado
    let finalSlides = [...imageUrls];
    if (window.imageConfig?.randomize_on_load) {
        for (let i = finalSlides.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalSlides[i], finalSlides[j]] = [finalSlides[j], finalSlides[i]];
        }
    }
    
    finalSlides.forEach((imgUrl, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'carousel-slide';
        if (idx === 0) slideDiv.classList.add('active');
        slideDiv.style.backgroundImage = `url('${imgUrl}')`;
        carouselContainer.appendChild(slideDiv);
        slides.push(slideDiv);
    });
    
    currentIndex = 0;
}

// Llamar a la nueva función en lugar de initCarousel()
// initCarouselWithJSON();