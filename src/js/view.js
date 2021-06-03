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
    pageElement.append(div);
  },

  renderUsers(model) {
    const pageElement = document.getElementById('users');
    const ul = document.createElement('ul');
    ul.classList.add('users__list')
    ul.innerHTML = renderUsers({model});
    pageElement.append(ul);
    },

  renderNewUser(model) {
    const pageElement = document.getElementById('users');
    const li = document.createElement('li');
    li.classList.add('user');
    li.innerHTML = renderNewUser(model)
    pageElement.append(li);
  }
}