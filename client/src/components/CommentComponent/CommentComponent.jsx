/* eslint-disable react/prop-types */

const CommentComponent = (props) => {
    // eslint-disable-next-line react/prop-types
  const {
    dataHref, 
    width = "100%"
  } = props
  return (
    <div style={{background: '#fff' , borderTop: '15px solid #efefef'}}>
      <div className="fb-comments" data-href={dataHref} data-width={width} data-numposts="5"></div> 
    </div>
  )
}
  
export default CommentComponent