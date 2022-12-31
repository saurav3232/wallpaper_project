import './ShowTags.styles.css'
const ShowTags = ({ props }) => {
    const { tagArray, setTagArray } = props;
    const deleteTagHandler=(tag)=>{
        const newArray=tagArray.filter(tg=>tg!==tag);
        setTagArray(newArray);
    }
    return (
        <div className="tagConatiner">
            {tagArray.map((tag, idx) => <div className='tagItems' key={idx}>{tag} <button type="button" className="btn-close" aria-label="Close" onClick={()=>deleteTagHandler(tag)}></button></div>)}
        </div>
    )
}

export default ShowTags
