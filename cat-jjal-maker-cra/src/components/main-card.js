//디스트럭처링 문법 props를 {img}로 풀어서 바로 사용 가능
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    //조건부 렌더링
    const heartIcon = alreadyFavorite ? "💖" : "🤍";
    return (
        <div className="main-card">
            <img src={img} alt="고양이" width="400" />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    );
};

export default MainCard;
