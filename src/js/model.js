import renderModalPhoto from '.././templates/modalPhoto.hbs';

export default {
  initWS() {
   return new Promise((resolve) => {
    const ws = new WebSocket('ws://localhost:5151');
    ws.onopen = () => resolve(ws);
   })
  },

  login(ws) {
    const form = document.querySelector('.modal__form');
    const input = document.querySelector('.modal__form-input');
    const modal = document.querySelector('.modal');
      return new Promise((resolve) => {
      form.addEventListener('submit', e => {
        try {
          if (!input.value) {
            throw new Error('Укажите свой никнейм!')
          } else if (input.value.length < 3) {
            throw new Error('Никнейм должен состять из 3 и более символов')
          } 
            let nickname = input.value.trim();
            document.body.removeChild(modal);
            this.sendRequest(ws, 'LOGIN', {name: nickname})
            input.value = '';
            resolve(ws);
        } catch (e) {
          alert(e.message);
        }})
      })},

  messageListener(ws) {
    const button = document.querySelector('.chat__button');
    const input = document.querySelector('.chat__input');

    button.addEventListener('click', e => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        this.sendRequest(ws, 'MESSAGE', { text: message })
        input.value = '';
      }
    })
  },

  photoLoadListener(ws) {
    document.addEventListener('click', e => {
      if (e.target.tagName === 'IMG' && e.target.closest('.user__current')) {
        const user = e.target.closest('.user__current')
        const login = user.querySelector('.user__login').textContent;
        this.photoLoaderWindow(login, ws);
      }
    })
  },

  photoLoaderWindow(login, ws) {
    const modalPhoto = document.querySelector('.modal__photo');
    modalPhoto.classList.remove('hidden');
    modalPhoto.innerHTML = renderModalPhoto(login);


    const photoInput = document.querySelector('.photo__input');
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      
      if (file) {
        const reader = new FileReader();
        const previewImage = document.querySelector('.photo__preview-img');
        
        reader.addEventListener('load', () => {
          previewImage.setAttribute("src", reader.result);
          this.photoPreviewWindow(ws, login);
          modalPhoto.classList.add('hidden');
        })

        reader.readAsDataURL(file);
      } 
    })

    modalPhoto.addEventListener('click', e => {
      if (e.target.tagName === 'SPAN') {
        modalPhoto.classList.add('hidden');
      } 
      if (e.target.closest('.photo__img-container')) {
        photoInput.click();
      }
    })
  },

  photoPreviewWindow(ws, login) {
    const previewWindow = document.querySelector('.modal__photo-preview');
    previewWindow.classList.remove('hidden');
    const saveButton = previewWindow.querySelector('.photo__preview-btn-save');
    const cancelButton = previewWindow.querySelector('.photo__preview-btn-cancel');
    const previewImage = document.querySelector('.photo__preview-img');

    cancelButton.addEventListener('click', e =>  {
      previewWindow.classList.add('hidden');
      previewImage.setAttribute('src', "#");
    })

    saveButton.addEventListener('click', e => {
      const imageURL = previewImage.attributes.src.value;
      this.sendRequest(ws, 'PHOTO', {photo: imageURL, name: login} );
      previewWindow.classList.add('hidden');
      previewImage.setAttribute('src', "#");
    })
  },

  sendRequest(ws, type, params = {}) {
    const request = {
      type: type,
      data: params
    }
    return new Promise((resolve) => {
      ws.send(JSON.stringify(request))
      resolve()
    })
  }

}