function showToast(message, removeAtEnd = false) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.style.opacity = '1';
      toast.style.zIndex = '7777';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
  
    if (removeAtEnd) {
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
  }
  
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  