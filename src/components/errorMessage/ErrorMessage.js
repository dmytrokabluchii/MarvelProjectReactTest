import img from './error.gif';

// Компонент с ошибкой(с сообщением и тд), кот-й мы сможем испол-м где нам нужно
const ErrorMessage = () => {
    const styleForImage = {diplay: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}
    return (
        // Для работы с папкой public испол-м спец. перем-ю "окружения"
        // Если нам в папке src/public понадобится статичный файл то сможем обрат-ся к нему по след-й констр-и
        // <img src={process.env.PUBLIC_URL + '/error.gif'} />
        <img style={{styleForImage}} 
             src={img} alt="Error" 
        />
    )
}
export default ErrorMessage;