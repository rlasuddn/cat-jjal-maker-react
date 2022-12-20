const Title = ({ counter }) => {
    let res = counter ? <h1>{counter}번째 고양이 가라사대</h1> : <h1>고양이 가라사대</h1>
    return res
}

export default Title
