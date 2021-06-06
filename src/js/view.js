import renderUsers from '.././templates/users.hbs'
import renderNewUser from '.././templates/user.hbs'
import renderCurrentUser from '.././templates/currentUser.hbs'


export default {

  renderCurrentUser(model) {
    const pageElement = document.getElementById('users');
    const div = document.createElement('div');
    div.classList.add('user');
    div.classList.add('user__current');
    div.innerHTML = renderCurrentUser(model);
    pageElement.prepend(div);
    this.updateCounter();
  },

  renderUsers(model) {
    const ul = document.querySelector('ul');
    ul.innerHTML = renderUsers({model});
    this.updateCounter();
    },

  renderNewUser(model) {
      const ul = document.querySelector('ul');
      const li = document.createElement('li');
      li.classList.add('user');
      li.dataset.name = model.name;
      li.innerHTML = renderNewUser(model)
      ul.append(li);
      this.updateCounter();
      this.sendNotice(model.name, 'LOGIN')
  },

  removeUser(user) {
    const ul = document.querySelector('ul');
    for (let child of ul.children) {
      if (child.attributes['data-name'].value === user) {
        ul.removeChild(child)
      }
    }
    this.updateCounter();
    this.sendNotice(user, 'CLOSE');
  },

  updateCounter() {
    const counter = document.querySelector('.chat__counter');
    let array = document.getElementsByClassName('user');
    const users = array.length;
    if (users === 1) {
      counter.textContent = `1 участник`;
    } else if (users > 1 && users < 5) {
      counter.textContent = `${users} участника`
    } else if (users >= 5) {
      counter.textContent = `${users} участников`
    }
  },

  sendNotice(user, event) {
    const div = createDiv();
    if (event === 'LOGIN') {
      div.textContent = `${user} вошел в чат`
    } else if (event === 'CLOSE') {
      div.textContent =`${user} вышел из чата`
    }
    function createDiv() {
      const messages = document.querySelector('.messages');
      const div = document.createElement('div');
      div.classList.add('messages__notice');
      messages.append(div);
      return div;
    }
  },

  sendMessage(from, text) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const time = `${hours}:${minutes}`;
    const item = document.createElement('div');
    item.classList.add('message');

    item.innerHTML = `
    <div class="message-item-left">
    <div style="background-image: url(/mega-chat-3/photos/${from}.png?t=${Date.now()})" 
    class="message-item-photo" data-role="user-avatar" data-user=${sanitize(
      from)}></div>
</div>
<div class="message-item-right">
  <div class="message-item-header">
      <div class="message-item-header-name">${sanitize(from)}</div>
      <div class="message-item-header-time">${time}</div>
  </div>
  <div class="message-item-text">${sanitize(text)}</div>
</div>
`;

  }
}