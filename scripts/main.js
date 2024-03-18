// Aquest codi ens ajuda a mostrar informació de les imatges de manera dinàmica

const images = Array.from(document.querySelectorAll("img"));
const infoContainers = Array.from(document.querySelectorAll(".image-info"));

// Per obtenir el "pes" d'una imatge a JS podem fer servir el mètode fetch per obtenir la imatge com a blob i després obtenir la seva mida en bytes.
// Més info sobre Blob --> https://es.javascript.info/blob

async function getImageInfo(url) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const response = await fetch(url);
        // blob és un tipus de dades que representa un objecte de dades binàries. En el cas de les imatges
        const blob = await response.blob();
        console.dir(blob);
        const format = url.split(".").pop();
        const dimensions = {
          width: img.width,
          height: img.height,
        };
        const alt = img.alt;
        const size = blob.size;

        // Devolvemos el tamaño de la imagen y los demás datos
        resolve({ format, dimensions, alt, size });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
  });
}

const container = document.querySelector("#image-info-container");

// Función para calcular el porcentaje de reducción
function calculateReductionPercentage(originalSize, newSize) {
  const originalSizeInKB = (originalSize / 1024).toFixed(2);
  const newSizeInKB = (newSize / 1024).toFixed(2);
  const reductionPercentage = ((1 - (newSize / originalSize)) * 100).toFixed(2);
  return `${reductionPercentage}% (${originalSizeInKB} KB -> ${newSizeInKB} KB)`;
}

// Obtenemos el tamaño de la imagen original
const originalImageUrl = document.querySelector("img.original").src;
getImageInfo(originalImageUrl)
  .then((originalImageInfo) => {
    const originalSize = originalImageInfo.size;

    // Mostramos la información de cada imagen
    images.forEach(async (img, i) => {
      const newImageInfo = await getImageInfo(img.src);
      const reductionInfo = calculateReductionPercentage(originalSize, newImageInfo.size);

      const formatElement = document.createElement("p");
      formatElement.textContent = `Format: ${newImageInfo.format}`;
      infoContainers[i].appendChild(formatElement);

      const dimensionsElement = document.createElement("p");
      dimensionsElement.textContent = `Dimensions: ${newImageInfo.dimensions.width}x${newImageInfo.dimensions.height}`;
      infoContainers[i].appendChild(dimensionsElement);

      const altElement = document.createElement("p");
      altElement.textContent = `Alt: ${newImageInfo.alt}`;
      infoContainers[i].appendChild(altElement);

      const sizeElement = document.createElement("p");
      sizeElement.textContent = `Size: ${(newImageInfo.size / 1024).toFixed(2)} KB`;
      infoContainers[i].appendChild(sizeElement);

      const reductionElement = document.createElement("p");
      reductionElement.textContent = `Reduction: ${reductionInfo}`;
      infoContainers[i].appendChild(reductionElement);
    });
  })
  .catch(console.error);