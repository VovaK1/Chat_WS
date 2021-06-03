export default {
  initWS() {
   return new Promise((resolve) => {
    const ws = new WebSocket('ws://localhost:5501');
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
            let nickname = input.value;
            document.body.removeChild(modal);
            this.sendRequest(ws, 'LOGIN', {name: nickname})
            resolve(ws);
        } catch (e) {
          alert(e.message);
        }})
      })},

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