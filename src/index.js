import './index.hbs'
import './styles/main.scss'

import Model from './js/model.js'
import Controller from './js/controller.js';
import View from './js/view.js'



Model.initWS()
  .then((ws) => Model.login(ws))
  .then((ws) => {
    Controller.responseHandler(ws);
    Model.messageListener(ws);
    
  })
  


