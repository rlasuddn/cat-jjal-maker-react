import React from "react";
const Form = ({ updateMainCat }) => {
    //form 데이터 값 상태 초기화
    const [value, setValue] = React.useState("");
    //errorMessage 상태 초기화
    const [errorMessage, setErrorMessage] = React.useState("");
    //한글 입력 validation
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

    //form > input에 값이 변경될때
    function handleInputChange(event) {
        const formValue = event.target.value;
        setErrorMessage(""); //errorMessage 초기화
        if (includesHangul(formValue)) setErrorMessage("한글은 입력할 수 없습니다.");
        //value는 항상 대문자로 표기
        setValue(formValue.toUpperCase());
    }

    //form submit 실행
    function handleFormSubmit(event) {
        event.preventDefault();
        setErrorMessage("");

        if (includesHangul(value)) {
            alert("영문으로 입력해주세요.");
            return;
        }

        if (!value) {
            setErrorMessage("입력해 주세요");
            return;
        }

        updateMainCat(value);
    }
    return (
        <form onSubmit={handleFormSubmit}>
            <input type="text" name="name" placeholder="영어 대사를 입력해주세요" onChange={handleInputChange} value={value} />
            <button type="submit">생성</button>
            {errorMessage !== null && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default Form;
