
function copyMoves() {
    const movesDivs = document.querySelectorAll('.moves');

    if (movesDivs.length === 0) {
        console.error('No elements with class .moves found');
        return;
    }

    // Créez le toast et ajoutez-le au corps du document
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);

    movesDivs.forEach(div => {
        div.addEventListener('click', () => {
            let textToCopy = div.textContent || '';
            textToCopy = textToCopy.replace(/\s+/g, ' ').trim();

            if (!textToCopy) {
                console.error('No text to copy');
                return;
            }

            navigator.clipboard.writeText(textToCopy).then(
                () => {
                    showToast('Fleet movement copied successfully!');
                },
                (err) => {
                    console.error('Échec de la copie : ', err);
                    showToast('Échec de la copie.');
                }
            );
        });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000); // La notification disparaît après 4 secondes
    }

    // Ajoutez les styles du toast via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        #toast {
            position: fixed;
            top: 50px;
            right: 20px;
            background-color: yellow;
            color: black;
            padding: 20px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.5s;
            z-index: 1000;
            font-size: 14px
        }

        #toast.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
};

setTimeout(copyMoves, 3000); // Délai pour s'assurer que le DOM est chargé