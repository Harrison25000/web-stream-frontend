import { useEffect, useState } from 'react';
import { getComments, submitComment } from '../Helpers';
import '../css/comments.css';

const Comments = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getComments().then(comments => setComments(comments));
    }, [])

    setInterval(function () {
        getComments().then(comments => setComments(comments));
    }, 10000)

    return (
        <div className="CommentSection">
            <form id="commentForm" onSubmit={(e) => submitComment(e)}>
                <input type="text" id="commentText" />
                <input type="submit" id="commentSubmit"></input>
            </form>
            {comments && comments.map(comment => {
                return (
                    <div className="CommentDiv">
                        <p>{comment.comment}</p>
                        <p>{comment.time}</p>
                    </div>)
            })}
        </div>
    )
}

export default Comments;