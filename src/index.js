import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
// import MarvelService from './services/MarvelService';

import './style/style.scss';


// Для работы с классами нужно создать его экземпляр и теперь в marvelService будет хранится потомок нашего класса
// const marvelService = new MarvelService();
// Сделаем запрос на сервер полученные данные выведем в консоль
// marvelService.getAllCharacters().then(res => console.log(res));
// Где в () вписываем id персонажа
// marvelService.getCharacter(1011052).then(res => console.log(res));

// Переберем массив полученных данных и выведем только имена
// marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

