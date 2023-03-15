import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';



class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        // Это св-во будет вызываться вручную, после вызова onRequest
        newItemLoading: false,
        // Когда запрос на сервер завершен успешно, мы число 210 должны увел-ть на число персонажей кот-е нам пришло
        offset: 1543,
        charEnded: false
    }
    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0;
        // this.marvelService.getAllCharacters()
        //     .then(this.onCharListLoaded)
        //     .catch(this.onError)
        this.onRequest();
    }

    // Создадим метод отвечающий за запрос на сервер, (для реал-и функционала кнопки Load More)
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    // Запустился запрос и что-то грузится
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    // Загрузились новые данные, где newCharList - это новые получ-е данные и из них мы будем формир-ть новое состояние charList
    onCharListLoaded = (newCharList) => {
        // Запишем новый state кот-й будет удалять нашу кнопку если он true
        let ended  = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            // Где изначально в ...charList будет пустой массив, но когда наши персонажи уже загруз-сь, 
            // мы charList формир-м из тех персонаей что были(9 старых) + еще 9 новых и в итоге они сложаться в новый массив
            // и далее объедин-й массив(charList) пойдет уже в верстку
            charList: [...charList, ...newCharList ], 
            loading: false,
            newItemLoading: false,
            // Увеличиваем кол-во пришедших от сервера персонажей на 9
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Lesson 159 Рефы Д/З
    itemRefs = [];
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    focusOnItem = (id) => {
        // вариант и с классом и с фокусом, но в теории можно оставить только фокус, 
        // и его в стилях использовать вместо класса.
        // По возможности, не злоупотреблять рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }


    // Метод создан для оптимизации, чтобы не помещать конст-ю в render
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            // console.log(item.id);
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                // Ключ по id мы достаем из API
                // у каждого персонажа он свой и достается он внутри MarvelService
                <li className="char__item" 
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id); 
                        this.focusOnItem(i);
                    }}
                    // Событие onkeypress стоит между onkeydown и onkeyup, т.к. оно возникает при нажатии клавиши клавиатуры
                    // Работает с tab, enter
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}   
                >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render () {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    // Атрибут disabled устан-м в зав-ти от нашего св-ва newItemLoading
                    disabled={newItemLoading}
                    // формир-м новый объект с условием, значение которого(none/block) запиш-ся в display
                    // В рез-те если нечего больше будет грузить, то кнопка исчезнет
                    style={{'display': charEnded ? 'none' : 'block'}}
                    // Аргументом в колбек фун-и будет текущее состояние offset
                    onClick={ () => this.onRequest(offset) }>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    // Проверка на обязательное значение, тип функция(у нас метод)
    onCharSelected: PropTypes.func.isRequired
}

    

export default CharList;