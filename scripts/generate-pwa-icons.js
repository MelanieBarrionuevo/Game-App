const fs = require('fs');
const path = require('path');

// Crear un script que genera los PNGs desde Canvas en Node
// Instalamos sharp si no está disponible

try {
  const sharp = require('sharp');
  
  const svgIcon = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#grad)" rx="115"/>
      
      <!-- Cepillo de dientes -->
      <g transform="translate(80, 100)">
        <rect x="20" y="40" width="10" height="130" fill="white" rx="5"/>
        <circle cx="25" cy="30" r="15" fill="white"/>
        <rect x="10" y="170" width="30" height="20" fill="white" rx="5"/>
      </g>
      
      <!-- Auto -->
      <g transform="translate(260, 130)">
        <ellipse cx="70" cy="90" rx="80" ry="45" fill="white"/>
        <circle cx="35" cy="110" r="20" fill="#667eea"/>
        <circle cx="105" cy="110" r="20" fill="#667eea"/>
        <rect x="45" y="50" width="50" height="30" fill="#667eea" rx="5"/>
      </g>
      
      <!-- Gota de agua -->
      <g transform="translate(140, 280)">
        <path d="M 40 15 Q 25 40 25 55 Q 25 75 40 75 Q 55 75 55 55 Q 55 40 40 15" fill="white"/>
      </g>
    </svg>
  `;

  const sizes = [192, 512];
  
  sizes.forEach(size => {
    sharp(Buffer.from(svgIcon))
      .resize(size, size, { fit: 'fill' })
      .png()
      .toFile(path.join(__dirname, '..', 'build', `icon-${size}.png`))
      .then(info => {
        console.log(`✓ icon-${size}.png creado`);
      })
      .catch(err => {
        console.error(`Error creando icon-${size}.png:`, err);
      });
  });

  // Crear maskable icons (para Android)
  sizes.forEach(size => {
    sharp(Buffer.from(svgIcon))
      .resize(size, size, { fit: 'fill' })
      .png()
      .toFile(path.join(__dirname, '..', 'build', `icon-maskable-${size}.png`))
      .then(info => {
        console.log(`✓ icon-maskable-${size}.png creado`);
      })
      .catch(err => {
        console.error(`Error creando icon-maskable-${size}.png:`, err);
      });
  });

} catch (err) {
  console.log('Sharp no disponible, usando método alternativo...');
  console.log('Por favor, abre generar-iconos.html en el navegador para generar los PNGs');
}
