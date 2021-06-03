import View from './view.js'

export default {

  responseHandler(ws) {
    ws.onmessage = (message) => {
    const response = JSON.parse(message.data)
    switch (response.type) {
      case 'USERS':
        View.renderUsers(response.data);
         break;
      case 'LOGIN':
        console.log(response.data)
        View.renderUser(response.data);
          break;
        default:
        console.log('Unknown response');
    }
    }}
}