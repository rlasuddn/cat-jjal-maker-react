import CatItem from "./cat-item";

const Favorites = ({ favorites }) => {
    //조건부 렌더링
    if (favorites.length === 0) {
        return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
    }
    //배열을 순회할때 각 값의 고유키가 있어야 화면에 최적화 되어 보여준다. 현재 CAT 이미지의 유니크 키값은 url이므로 url 사용
    return (
        <ul className="favorites">
            {favorites.map((cat) => (
                <CatItem img={cat} key={cat} />
            ))}
        </ul>
    );
};
export default Favorites;
