import renderUsers from '.././templates/users.hbs'
import renderNewUser from '.././templates/user.hbs'
import renderCurrentUser from '.././templates/currentUser.hbs'
import renderMessage from '.././templates/message.hbs'


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
    item.classList.add('message')

    const obj = this.createMessageObj(from, time, text);
    item.innerHTML = renderMessage(obj);

    const currentUser = document.querySelector('.user__current');
    const currentUserName = currentUser.querySelector('.user__login').textContent;
    if (currentUserName !== from) {
      item.classList.add('inverted');
    } else {
      item.querySelector('.message-item-header').textContent = 'Вы'
    }

    const messageContainer = document.querySelector('.messages');
    messageContainer.append(item);
  },

  createMessageObj(from, time, text) {
    return {
      from: from,
      time: time,
      text: text
    }
  }
}