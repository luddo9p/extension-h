(function() {
    // Select all the images inside divs with class 'ecomap hc'
    var images = document.querySelectorAll('div.ecomap.hc img');
  
    if (images.length === 0) return;
  
    // Create a new div to hold the overlaid images
    var overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'relative';
    overlayDiv.style.display = 'inline-block'; // Adjust to fit content
  
    // Assume all images have the same dimensions
    var firstImage = images[0];
  
    // Function to initialize the overlay after images have loaded
    var initializeOverlay = function() {
      overlayDiv.style.width = firstImage.naturalWidth + 'px';
      overlayDiv.style.height = firstImage.naturalHeight + 'px';
  
      // For each image
      images.forEach(function(img) {
        // Clone the image
        var imgClone = img.cloneNode();

        imgClone.src = img.src + '?v='+Math.round(Math.random()*Math.random()*10000000);
  
        // Set styles to position it absolutely
        imgClone.style.position = 'absolute';
        imgClone.style.top = '0';
        imgClone.style.left = '0';
        imgClone.style.width = '100%';
        imgClone.style.height = '100%';
        imgClone.style.opacity = '0';

        /* Add a border to the image */

        if(imgClone.src.includes('factories')) {
            imgClone.style.opacity = '0.6';
            imgClone.style.filter = 'brightness(2) saturate(5) contrast(2.5)';
        }

        if(imgClone.src.includes('ecomark')) {
            imgClone.style.opacity = '0.4';
            imgClone.style.filter = 'saturate(5) contrast(2.5)';
        }

  
        // Append the cloned image to overlayDiv
        overlayDiv.appendChild(imgClone);
      });
  
      // Append the overlayDiv to the document
      var container = firstImage.parentNode.parentNode;
      container.parentNode.insertBefore(overlayDiv, container.nextSibling);
    };
  
    // Check if images are loaded
    if (firstImage.complete) {
      initializeOverlay();
    } else {
      firstImage.onload = initializeOverlay;
    }
  })();
  