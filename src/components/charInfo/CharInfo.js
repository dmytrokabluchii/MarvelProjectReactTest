import { Component } from 'react';

import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


class CharInfo extends Component {
    state = {
        char: null,
        // Т.к. загрузка пойдет только по действию от пользователя то загрузку ставим в позицию false
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    // Метод ниже вызывается после того как компонент был создан на странице и это хороший момент для 
    // работ с запросами на сервер и делать что-то асинхронное для работы с нашим API
    componentDidMount() {
        this.updateChar();
    }

    // Когда в компонент приходит новый пропс, он должен перерен-ся и мы должны отловить этот момент обновления
    // получить новые данные и вставить их в верстку(интерфейс). И тут нам поможет комп-т жизн.цикла componentDidUpdate
    // Он принимает в себя 3 аргумента, 2 мы расссмотрим, а 3-й испол-ся редко
    // Он как аргументы принимает в себя пред.состояние и пред.пропсы
    componentDidUpdate(prevProps, prevState) {
        // Если в этом компоненте мы не пропишем условие ниже, то при вызове(клике) на персонажа мы получим
        // множенственные вызовы на сервер и ошибку в результате
        if(this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    // Lesson 153 Хук componentDidCatch() вызыв-ся тогда, когда в компоненте произошла ошибка
    // и принимает он 2 аргумента, где err это сама ошибка, а info это инфор-я о том компоненте где произошла ошибка
    // componentDidCatch(err, info) {
    //     console.log(err, info);
    //     this.setState({error: true});
    // }


    // Метод меняющий наши персонажи по клику на них
    updateChar = () => {
        // Деструктуририруем наш charId из пропсов
        const {charId} = this.props;
        // Если его не будет, то просто останавливаем его
        if (!charId) {
            return;
        }
        // Чтобы перед нашим запросом показывался спинер
        this.onCharLoading();

        // Если уникал-й id уже есть то будем делать запрос на сервер, 
        // обращаемся к серверу marvelService в котором есть метод getCharacter
        // Когда прийдет ответ от сервиса(marvelService), в формате объекта с персонажем(getCharacter)
        // то он попадет в onCharLoaded в качестве аргумента (char) и запишется в состояние(setState)
        // Ну а если произошла ошибка, то вызываем метод с ошибкой
        this.marvelService
            .getCharacter(charId)
            // И далее орабатываем ответ через then() и catch()
            .then(this.onCharLoaded)
            .catch(this.onError);
            // Создадим специально ошибку, в несуществующий метод запишем значение
            // this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        // Вытаскиваем все сущности из нашего стейта
        const {char, loading, error} = this.state;

        // Если у нас не загружен персонаж, нет загрузки и нет ошибки, т.е. если у нас что-то из
        // перечисленного есть, то мы ничего не рендерим(null), в противном случае отображаем компонент скелетона
        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        // Если у нас идет не загрузка, не ошибка и есть уже персонаж
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {/* В зависимости от нашего стейта у нас отобразится один из компонентов */}
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

// Чтобы верстка не была громоздкой разделим её на 2 компонента, 1.занимается интерфейсом, 2.логикой и состоянием
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    // console.log(comics);
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        // Далее испол-м React-фрагмент
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list"> 
                {/* Д/З №2 если комиксов нет, уведомить про это, мой вариант */}
                    {/* {(comics.length === 0) ? 'No comics for this character' : null} */}
                    {/* Вариант Ивана: {comics.length > 0 ? null : 'There is no comics with this character'} */}

                    {/*В лог-м контексте 0 и есть false, значит можно и не срав-ть с 0! */}
                    {!comics.length ? 'No comics for this character' : null}

                    {
                        comics.map((item, i) => {
                            // Д/З №1 отобразить только 10 комиксов, мой вариант
                            // if (i >= 0 && i <= 9) { return (<li key={i} className="char__comics-item">{item.name}</li>)}
                            if (i > 9) return;
                            return ( 
                                <li key={i} className="char__comics-item"> 
                                    {item.name} 
                                </li> 
                            )
                        })
                    }
                </ul>
        </>
    )
}

// Lesson 155 Проверка типов с помощью PropTypes
CharInfo.propTypes = {
    // В объекте мы будем записывать как св-во название того props что приходит(например charId) 
    // и значением этого св-ва запишем его валидацию, т.е. чем оно должно являться
    // и для этого испол-м сущность PropTypes(импортируемую в начале файла)
    // PropTypes.number - значит что charId у нас обязательно должен быть числом
    // и если это так и есть то при клике на персонаж в консоле мы ничего не увидим
    // А если запишем: charId: PropTypes.string то будет ошибка и увидим соот. уведом-е:
    // index.js:1 Warning: Failed prop type: Invalid prop `charId` of type `number` supplied to `CharInfo`, expected `string`.
    // Т.е. мы получили число а, должна быть строка.
    // В тех документации мы увидим боль-е количество возможных примеров проверок:
    // https://ru.reactjs.org/docs/typechecking-with-proptypes.html
    charId: PropTypes.number
}

export default CharInfo;