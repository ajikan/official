/* A crude encapsulation of DOM operations */
export const ui = {
    overlay: document.querySelector('.overlay'),
    container: document.querySelector('.container'),
    input: document.querySelector('.four-oh-four-form input'),
    newOutput: document.querySelector('.new-output'),
    fourOhFourForm: document.querySelector('.four-oh-four-form'),
    terminal: document.querySelector('.terminal'),
    header: document.querySelector('.header'),
    loading: document.querySelector('.loading'),
    progressBar: document.querySelector('#progress-bar'),
    about: document.querySelector('.about'),
    spine: document.querySelector('.spine-outer'),

    hideProgress() {
        this.loading.classList.add('fade');
    },
    fadeIn() {
        this.loading.classList.add('hidden');
        this.container.classList.remove('fade');
        this.header.classList.remove('fade');
        canvas.classList.remove('fade');
        this.input.focus();
    },
    updateProgress(progress) {
        this.progressBar.style.width = `${100 * progress}%`;
    },
    setupListeners(startConstruct) {
        document.querySelector('.container').addEventListener('click', () => {
            document.querySelector('.four-oh-four-form input').focus();
        });
        document.querySelector('.four-oh-four-form input').addEventListener('keyup', () => {
            document.querySelector('.new-output').innerText = document.querySelector('.four-oh-four-form input').value;
        });
        this.fourOhFourForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            var val = document.querySelector('.four-oh-four-form input').value;
            document.querySelector('.four-oh-four-form input').value = '';
            document.querySelector('.new-output').classList.remove('new-output');  
            document.querySelector('.terminal').insertAdjacentHTML('beforeend', '<p class="prompt">Welcome ' + val + '! I\'m so glad you can join me on this journey...</p>');
            
            setTimeout(startConstruct, 2000);
        });
    },
    hideOverlay() {
        this.container.style.display = 'none';
        this.terminal.style.display = 'none';
        this.header.classList.add('fade');
        //this.overlay.style.display = 'none';
        //this.overlay.style.pointerEvents = 'none';
    },
    revealOverlay() {
        this.about.style.display = 'inline';
        setTimeout(() => {
            this.header.classList.remove('fade');
            //this.header.style.pointerEvents = 'auto';
            this.about.classList.remove('fade');
            //this.about.style.pointerEvents = 'auto';
            this.spine.classList.remove('fade');
        }, 1000);
    }
};