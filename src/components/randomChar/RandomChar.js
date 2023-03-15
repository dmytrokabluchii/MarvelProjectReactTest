import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
// Ниже просто запишем адресс(путь) к ресурсу в перм-ю и далее будем его испол-ть в src 
import mjolnir from '../../resources/img/mjolnir.png';


// Здесь мы испол-м резул-ты работы сетевого компонета MarvelService
// Данный компонент отвечает за отображения рандомного персонажа у нас на странице
class RandomChar extends Component {
    // Вызовем созданный ниже по иерархии метод updateChar. Вызов методов которые общаются с сервером и тд и 
    // созд-х ниже по иерархии может вызывать ошибки и это мы в будущем исправим
    constructor(props) {
        super(props);
        // this.updateChar();
        // console.log('constructor');
    }

    // Испол-м синтаксис полей класса, для этого испол-м state содер-й некот-е данные
    // Названия данных берем с /v1/public/characters/{characterId} на сайте
    // где thumbnail это наша превьюшка(картинка), сост. из адреса к файлу и расширения(jpg)
    // homepage и wiki это наши кнопки
    state = {
        char: {},
        loading: true,
        error: false
    }

    // Создадим новое св-во внутри класса(испол-я синтаксис полей классов)
    // Аналог this.marvelService внутрь котрого помещён конструктор
    marvelService = new MarvelService();

    // Lesson 151 Жизненный цикл(этап) компонентов

    // Монтирование, т.е. загрузка компонента
    componentDidMount() {
        // this.foo.bar = 0;
        // После переноса метода updateChar с constructor в componentDidMount() у нас исчезла ошибка в консоли
        // и дублирование запроса
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 10000);
        // console.log('mount');
    }

    // componentDidUpdate() { console.log('update') }

    // Хук ниже запускается тогда когда компонент исчезает со страницы
    componentWillUnmount() {
        clearInterval(this.timerId);
        // console.log('unmount')
    }

    // Если персонаж загрузился то выполняем след-е и
    onCharLoaded = (char) => {
        // console.log('update');
        // Как только загружаются данные у нас, позиция loading будет false
        this.setState({
            char, 
            loading: false
        })
    }

    // Метод добав-т спинер перед загрузкой персонажа когда кликаем на TRY IT
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    // Метод кот-й устан-т ошибку
    onError = () => {
        this.setState({
            // Если произошла ошибка, то нет загрузки
            loading: false,
            error: true
        })
    }

    // Создадим метод кот-й будет обращ-ся к серверу, получать данные и записывать их в state
    updateChar = () => {
        // Реализуем наш случайный идентификатор, котрый будет принимать рандомный "персонаж" с данных
        // const id = 1011005;
        // округлим наш id(чтобы было целое число без дробей) испол-м Math.floor()
        // Также создадим случайное число в опред-м диапазоне чисел(формула гуглится и испол-сь в д/з с React State counter)
        // где 1011000 это мин. значение диапазона
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        // const id = Math.floor(Math.random() * (1010789 - 1009146) + 1009146);

        // Перед тем как выполнится запрос ставим спинер
        this.onCharLoading();

        this.marvelService 
            .getCharacter(id)
            // Из методы getCharacter возвр-ся нужный нам обьект, далее он идет аргументом(res) в коллбек фун-ю ниже
            // и мы его сразу же передаем в setState
            .then(this.onCharLoaded)
            // Испол-и метод кот-й выкинет ошибку
            .catch(this.onError);
    }

    render() {
        // console.log('render');
        // Из св-ва char вытаскиваем след-е сущности(т.к. они лежат внутри него)
        const {char, loading, error} = this.state;
        // Если в прил-и ошибка то помещаем соот. компонент, либо ничего
        // Тоесть в перем-й у нас будет содер-ся либо ничего, либо компонент с ошибкой
        const errorMessage = error ? <ErrorMessage/> : null;
        // Если в компоненте есть загрузка то возвр-м компонент со спиннером
        const spinner = loading ? <Spinner/> : null;
        // Контент должен помещ-ся на стр-цу когда нет уже загрузки и при этом нет ошибки
        // Если нет загрузки или нет ошибки то показываем компонет View
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {/* Если компонент загружается прямо сейчас то вернем <Spinner/>, если нет то 
                компонету View как property(св-во) передадим char */}
                {/* {loading ? <Spinner/> : <View char={char}/>} */}

                {/* Если у нас в перем-й будет null то на стр-це ничего не отрендерится! */}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    {/* Д/З При нажатии на кнопку открывается рандомный персонаж onClick={() => {this.updateChar()}} */}
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
    
}

// Этот компонент будет просто отображать кусочек верстки, где char это все данные по персонажу
// Это будет у нас простой рендарящий компонент, без логики. Он просто получает объект с данными и 
// возвр-т часть верстки просто для отображения, а вся логипка идет в осн. компоненте RandomChar
const View = ({char}) => {
    // Где name, description и тд мы вытаскиваем из char
    const {name, description, thumbnail, homepage, wiki} = char;
    // Д/З - Динамически изменять стили когда есть картинка и когда заглушка
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                {/* <p className="randomchar__descr">{(description) ? `${description.slice(0, 210)}...` : 'No description about character'}</p> */}
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;