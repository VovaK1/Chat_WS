import renderUsers from '.././templates/users.hbs'
import renderUser from '.././templates/user.hbs'


export default {
  renderUsers(model) {
    const pageElement = document.getElementById('users');
    pageElement.innerHTML = renderUsers({model});
    },
  renderUser(userData) {
    const pageElement = document.getElementById('users');
    const li = document.createElement('li');
    li.classList.add('user');
    li.innerHTML = renderUser({userData})
    pageElement.append(li);
    console.log(li)
  }
}