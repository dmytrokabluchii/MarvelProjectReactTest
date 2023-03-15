
// Сетевая часть кода работающая с сервисом и отвечающая за трасформацию данных 
class MarvelService {
    // Значение св-ва класса начин-ся с _ говорит другим програм  -м что его нельзя менять
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=345f38814d1f16d5850a85234900ca02';
    // Базовый отступ для наших персонажей
    _baseOffset = 210;

    // фун-ю getResource возьмем с работы по JS-Food и немного изменим
    // Она нам будет возвращать данные в формате json
    getResource = async (url) => {
        // Тут мы просто делаем запрос через fetch() и дожидаемся его окончания
        let res = await fetch(url);
        // Promise возвращаемый вызовом fetch() не перейдёт в состояние "отклонено" из-за ответа HTTP, т.е. не выдаст ошибку!!!
        // и этот момент нам нужно предусмотреть и сделать спец. условие
        if (!res.ok) {
            // во внутрь объектa ошибки new Error в () помещаем текст ошибки
            // и чтобы эта ошибка выпала из фун-и есть спец. оператор throw, т.е. мы выкидываем новую ошибку
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        // далее трансфор-м данные получ-е выше с перем-й в обычный json-объект
        return await res.json();
    }

    // Будем делать запросы к нашему API и ниже мы добавим методы кот-е будут этим заниматься
    
    // - Метод для получения всех персонажей + добавляем функционал дозагрузки(Lesson 154)
    // Где агрументом будет offset = this._baseOffset - это позволит фун-и быть более гибкой
    // Т.к. она будет оттал-ся от аргумента, а если аргумент мы не передаем то тогда будет испол-ся базовый отступ в _baseOffset
    getAllCharacters = async (offset = this._baseOffset) => {
        // Фун-я ниже отдаст нам данные в формате json. Сформируем запрос
        // Адресс берем из Request URL с сайта marvel
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        // res это большой объект в которой есть массив с нашими результатами
        // (this._rtasformCharacter) таким образом мы перед-м callback фун-ю кот-я будет что-то делать с 
        // элементами что приходят к ней по очереди. В итоге сфор-ся массив с обьектами
        return res.data.results.map(this._rtasformCharacter);
    }

    // - Метод где получим одного определенного персонажа, далее испол-м метод в файле index.js
    // Чтобы фун-я правильно отрабатывала нужно сделать ее асинх-й
    // Когда метод будет запус-ся он будет ждать ответа и уже результат запишет в перем-ю res
    getCharacter = async (id) => {
        // Фун-я ниже отдаст нам данные в формате json. Сформируем запрос
        // Адресс берем из Request URL с сайта marvel
        // return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);

        // console.log(res); 
        // {id: 1011227, name: 'Amadeus Cho', description: '', modified: '2013-08-07T13:50:56-0400', thumbnail: {…}, …}
        // thumbnail: {path: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg', extension: 'jpg'} - заглушка
        // thumbnail: {path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/80/4ce5a6f45075d', extension: 'jpg'} - картинка

        // передадим полученный обьект из перем-й res в метод _rtasformCharacter для нужной нам трасформации
        // и теперь нам вернется объект только с теми данными что нужны
        return this._rtasformCharacter(res.data.results[0]);
    }

    // - Метод по транформации данных. Тут мы будем получать какие-то данные и возвращать уже трансф-й объект
    // На входе мы получаем обьект, а возвращать будем уже модифиц-й и в нужном нам виде. 
    _rtasformCharacter = (char) => {
        // console.log(char.thumbnail.path);
        return {
            // где data - это данные полученные от сервера, 
            // в results - нах-ся массив с данными(что там лежит можно увидеть в докум-и на сайте marvel)
            // в data.results[0].name находится - "3-D Man"

            // Вытащим из данных уникальный ключ-id персонажа и далее испол-м его уже в CharList
            id: char.id,
            name: char.name,
            // description: char.description,
            // description: 'Some text, Some text, Some text, Some text',
            // Д/З - если нет описания, доб-ть соот-й текст, если есть сократить его и добавить ...
            description: (char.description) ? `${char.description.slice(0, 210)}...` : 'No description about character',
            // В объекте ниже у нас находится 2 св-ва, это "path" с адресом и "extension" с расширением картинки
            // и ниже мы сформ-м единый путь к картинке, испол-м конкатенацию(соед-е) строк
            thumbnail: char.thumbnail.path + '.' +  char.thumbnail.extension,
            // В "urls" у нас находится массив с объектами внутри, в кот-х нах-ся св-ва "type" и "url"
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            // В API у нас также есть большой объект comics и там нас интересует большой массив(items) с объектами данных
            comics: char.comics.items
        }
    }
}

export default MarvelService; 

// slice() in work
// const text = 'My name is Dmytro';
// console.log(text.slice(0, 13));   // My name is Dm