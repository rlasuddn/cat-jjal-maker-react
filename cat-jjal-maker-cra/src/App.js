import logo from "./logo.svg";
import React from "react";
import "./App.css";

//유틸
import { jsonLocalStorage } from "./utils/utils";
import { fetchCat } from "./utils/utils";
import { CAT1 } from "./utils/utils";

//컴포넌트
import Title from "./components/title";
import Favorites from "./components/favorites";
import MainCard from "./components/main-card";
import Form from "./components/form";

//cra 생성 명령어: npx create-react-app 폴더명
/*
cra 배포 하기: npm run build로 build 실행 -> jsx파일이 아닌 build 파일을 업로드
npm i gh-pages -> package.json scripts "deploy": "gh-pages -d build" 명령어 추가
package.json 위 상단 "homepage": "{깃헙 페이지 주소}", 입력 마지막 "/" 제거

*/

const App = () => {
    //counter - useState로 지정한 초기값 setCounter - 초기값을 변형하는 함수
    /*
    useState의 인수로 함수를 전달하면 초기 렌더링시에만 작동하고 다음 렌더링에선 건너뛴다.
    즉, React.useState(jsonLocalStorage.getItem("counter")) 렌더링시 계속 불필요하게 로컬스토리지에 접근한다
    React.useState(() => jsonLocalStorage.getItem("counter")) 첫 렌더링시 로컬스토리지에 접근하고 다음 렌더링에선 접근하지 않는다.

    */
    let [counter, setCounter] = React.useState(() => jsonLocalStorage.getItem("counter"));

    //메인 이미지 초기 값 설정
    const [mainImg, setMainImg] = React.useState(CAT1);
    //하트 한 이미지들을 로컬스토리지에서 가져온다.
    const [favorites, setFavorites] = React.useState(() => jsonLocalStorage.getItem("favorites") || []);

    async function initMainCat() {
        const newCat = await fetchCat("First Cat");
        setMainImg(newCat);
    }
    /*
    컴포넌트 안에 있는 모든 코드는 컴포넌트의 상태 또는 UI가 바뀔때마다 계속 실행이된다.
    즉, App의 상태값 또는 UI 가 변경될때 마다 App안에 코드들은 실행된다.
    그래서 useEffect로 실행시점을 조절 할 수 있다.
    2번째 인자로 []을 주게 되면 App내에 UI가 변하는 첫번째 시점에만 해당 함수가 실행된다.
    또한 useState의 상태값을 주게되면 해당 상태가 변할때마다 실행 할 수 있게 해준다. ex)counter를 2번째 인수로 전달하면 counter가 바뀌는 시점마다 useEffect는 실행된다.
    */

    React.useEffect(() => {
        initMainCat();
    }, []);

    React.useEffect(() => {
        console.log("하이");
    }, []);

    const alreadyFavorite = favorites.includes(mainImg);

    //form submit 실행
    async function updateMainCat(value) {
        const newCat = await fetchCat(value);
        //메인 이미지 상태 변경
        setMainImg(newCat);

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
            const nextCount = ++prev;
            jsonLocalStorage.setItem("counter", nextCount);
            return nextCount;
        });

        //로컬스토리지 키 value는 string으로 저장된다 항상 Number 변환, 증감연산자로 자바스크립트가 암묵적 타입변환으로 해주기도 한다.
    }
    //button 클릭시 기존배열에 CAT3 데이터 추가
    function handleHeartClick() {
        //하트 버튼 클릭시 해당 이미지 favorites에 추가
        setFavorites([...favorites, mainImg]);
        //로컬스토리지에 저장
        jsonLocalStorage.setItem("favorites", favorites);
    }
    return (
        <div>
            <Title counter={counter} />
            {/*Title("2번째 고양이 가라사대")*/}

            {/*Form의 인수로 handleFormSubmit을 전달*/}
            <Form updateMainCat={updateMainCat} />
            <MainCard img={mainImg} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
            <Favorites favorites={favorites} />
        </div>
    );
};

export default App;
