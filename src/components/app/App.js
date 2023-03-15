import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    state = {
        selectedChar: null
    }
    // Далее установим метод устанав-й selectedChar.
    // Используем метод поднятия состояния, когда мы описываем свойство в state(selectedChar)
    // и далее созд-м метод(onCharSelected) чтобы устанавливать это св-во через аргумент(id)
    // и далее этот метод мы передадим в <CharList/>, под названием onCharSelected
    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    {/* Компонент который может сломаться стоит обернуть в "предохранитель", у нас это ErrorBoundary */}
                    <ErrorBoundary>
                        <RandomChar/>
                    </ErrorBoundary>
                    <div className="char__content">
                    <ErrorBoundary>
                        <CharList onCharSelected={this.onCharSelected}/>
                    </ErrorBoundary>
                        {/* А в CharInfo будем уже передавать id из state. 
                        Т.е из onCharSelected приходит, далее устанав-ся в state и далее перед-ся в компонент CharInfo*/}
                        {/* <CharInfo charId={this.state.selectedChar}/> */}
                        <ErrorBoundary>
                            <CharInfo charId={this.state.selectedChar}/>
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }  
}

export default App;