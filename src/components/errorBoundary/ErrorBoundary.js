import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

// Это как раз тот компонент, кот-й будет ловить ошибку
class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // Метод static getDerivedStateFromError() обновляет только state, т.е. наше состояние и всё
    // Это как бы аналог setState который работает только с ошибкой
    // Метод возвращает объект с новым state кот-й будет записан в state выше
    // static getDerivedStateFromError(error) {
    //     return {error: true};
    // }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState( {
            error: true
        })
    }
    // Далее отобразим эту ошибку
    render() {
        if (this.state.error) {
            // return <h2>Something went wrong</h2>
            // Вариант ниже для отображения гифки ошибки
            return <ErrorMessage/>
        }
        // Далее мы должны поместить во внутрь компонент, кот-й может сломаться
        // Констр-ю this.props.children мы пройдем через несколько уроков, 
        // пока это просто компонент перед-й во внутрь другого компонента(его ребёнок)
        return this.props.children;
    }
}

export default ErrorBoundary;