import logo from "./logo.svg"
import React from "react"
import "./App.css"
import Title from "./components/title"

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key))
    },
}

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com"
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`)
    const responseJson = await response.json()
    return `${OPEN_API_DOMAIN}/${responseJson.url}`
}

const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react"
const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn"
const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript"

//컴포넌트는 대문자로 시작
const CatItem = (props) => {
    return (
        <li>
            <img src={props.img} style={{ width: "150px" }} />
        </li>
    )
}

const Favorites = ({ favorites }) => {
    //조건부 렌더링
    if (favorites.length === 0) {
        return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
    }
    //배열을 순회할때 각 값의 고유키가 있어야 화면에 최적화 되어 보여준다. 현재 CAT 이미지의 유니크 키값은 url이므로 url 사용
    return (
        <ul className="favorites">
            {favorites.map((cat) => (
                <CatItem img={cat} key={cat} />
            ))}
        </ul>
    )
}
//디스트럭처링 문법 props를 {img}로 풀어서 바로 사용 가능
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    //조건부 렌더링
    const heartIcon = alreadyFavorite ? "💖" : "🤍"
    return (
        <div className="main-card">
            <img src={img} alt="고양이" width="400" />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    )
}

const Form = ({ updateMainCat }) => {
    //form 데이터 값 상태 초기화
    const [value, setValue] = React.useState("")
    //errorMessage 상태 초기화
    const [errorMessage, setErrorMessage] = React.useState("")
    //한글 입력 validation
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text)

    //form > input에 값이 변경될때
    function handleInputChange(event) {
        const formValue = event.target.value
        setErrorMessage("") //errorMessage 초기화
        if (includesHangul(formValue)) setErrorMessage("한글은 입력할 수 없습니다.")
        //value는 항상 대문자로 표기
        setValue(formValue.toUpperCase())
    }

    //form submit 실행
    function handleFormSubmit(event) {
        event.preventDefault()
        setErrorMessage("")

        if (includesHangul(value)) {
            alert("영문으로 입력해주세요.")
            return
        }

        if (!value) {
            setErrorMessage("입력해 주세요")
            return
        }

        updateMainCat(value)
    }
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                type="text"
                name="name"
                placeholder="영어 대사를 입력해주세요"
                onChange={handleInputChange}
                value={value}
            />
            <button type="submit">생성</button>
            {errorMessage !== null && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    )
}

const App = () => {
    //counter - useState로 지정한 초기값 setCounter - 초기값을 변형하는 함수
    /*
    useState의 인수로 함수를 전달하면 초기 렌더링시에만 작동하고 다음 렌더링에선 건너뛴다.
    즉, React.useState(jsonLocalStorage.getItem("counter")) 렌더링시 계속 불필요하게 로컬스토리지에 접근한다
    React.useState(() => jsonLocalStorage.getItem("counter")) 첫 렌더링시 로컬스토리지에 접근하고 다음 렌더링에선 접근하지 않는다.

    */
    let [counter, setCounter] = React.useState(() => jsonLocalStorage.getItem("counter"))

    //메인 이미지 초기 값 설정
    const [mainImg, setMainImg] = React.useState(CAT1)
    //하트 한 이미지들을 로컬스토리지에서 가져온다.
    const [favorites, setFavorites] = React.useState(
        () => jsonLocalStorage.getItem("favorites") || []
    )

    async function initMainCat() {
        const newCat = await fetchCat("First Cat")
        setMainImg(newCat)
    }
    /*
    컴포넌트 안에 있는 모든 코드는 컴포넌트의 상태 또는 UI가 바뀔때마다 계속 실행이된다.
    즉, App의 상태값 또는 UI 가 변경될때 마다 App안에 코드들은 실행된다.
    그래서 useEffect로 실행시점을 조절 할 수 있다.
    2번째 인자로 []을 주게 되면 App내에 UI가 변하는 첫번째 시점에만 해당 함수가 실행된다.
    또한 useState의 상태값을 주게되면 해당 상태가 변할때마다 실행 할 수 있게 해준다. ex)counter를 2번째 인수로 전달하면 counter가 바뀌는 시점마다 useEffect는 실행된다.
    */

    React.useEffect(() => {
        initMainCat()
    }, [])

    React.useEffect(() => {
        console.log("하이")
    }, [])

    const alreadyFavorite = favorites.includes(mainImg)

    //form submit 실행
    async function updateMainCat(value) {
        const newCat = await fetchCat(value)
        //메인 이미지 상태 변경
        setMainImg(newCat)

        /*
        카운터 상태 변경
        .useState에서 counter 상태값과 setCounter가 바라보는 상태값이 달라서
        .연속적으로 카운팅을 했을때 오류적인 값이 나온다.
        (setState는 성능 상 state를 한번에 처리하므로 비동기적으로 업데이트될 수 있다.)
        .setCounter(++counter);
        .jsonLocalStorage.setItem("counter", counter);

        .함수를 인수로 전달하면 해당 오류를 해결할 수 있다.
        .함수 전달시 count 값을 매개변수로 받을 수 있다.
        .정확한 count값을 로컬스토리지에 저장하기위해 setCounter함수안에서 setItem을 해준다.
        */
        setCounter((prev) => {
            const nextCount = ++prev
            jsonLocalStorage.setItem("counter", nextCount)
            return nextCount
        })

        //로컬스토리지 키 value는 string으로 저장된다 항상 Number 변환, 증감연산자로 자바스크립트가 암묵적 타입변환으로 해주기도 한다.
    }
    //button 클릭시 기존배열에 CAT3 데이터 추가
    function handleHeartClick() {
        //하트 버튼 클릭시 해당 이미지 favorites에 추가
        setFavorites([...favorites, mainImg])
        //로컬스토리지에 저장
        jsonLocalStorage.setItem("favorites", favorites)
    }
    return (
        <div>
            <Title counter={counter} />
            {/*Title("2번째 고양이 가라사대")*/}

            {/*Form의 인수로 handleFormSubmit을 전달*/}
            <Form updateMainCat={updateMainCat} />
            <MainCard
                img={mainImg}
                onHeartClick={handleHeartClick}
                alreadyFavorite={alreadyFavorite}
            />
            <Favorites favorites={favorites} />
        </div>
    )
}

export default App
