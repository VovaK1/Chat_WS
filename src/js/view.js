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
  },

  renderUsers(model) {
    const ul = document.querySelector('ul');
    ul.innerHTML = renderUsers({model});
    },

  renderNewUser(model) {
      const ul = document.querySelector('ul');
      const li = document.createElement('li');
      li.classList.add('user');
      li.dataset.name = model.name;
      li.innerHTML = renderNewUser(model)
      ul.append(li);
  },

  removeUser(user) {
    const ul = document.querySelector('ul');
    for (let child of ul.children) {
      if (child.attributes['data-name'].value === user) {
        ul.removeChild(child)
      }
    }
  }
}