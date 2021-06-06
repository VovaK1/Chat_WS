import View from './view.js'

export default {

  responseHandler(ws) {
    ws.onmessage = (message) => {
    const response = JSON.parse(message.data)
    switch (response.type) {
      case 'USERS':
        const allUsers = response.data;
        const currentUser = allUsers.shift();
        if (allUsers.length) {
          View.renderCurrentUser(currentUser);
          View.renderUsers(allUsers);
        } else {
          View.renderCurrentUser(currentUser);
        }
         break;
      case 'LOGIN':
        View.renderNewUser(response.data);
          break;
      case 'CLOSE': 
        View.removeUser(response.from);
        break;
        default:
        console.log('Unknown response');
    }
    }}
}