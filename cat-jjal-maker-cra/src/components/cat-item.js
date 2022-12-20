//컴포넌트는 대문자로 시작
const CatItem = (props) => {
    return (
        <li>
            <img src={props.img} style={{ width: "150px" }} />
        </li>
    );
};
export default CatItem;
