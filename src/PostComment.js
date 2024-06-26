import React from 'react';
import { useState, useEffect } from "react";
import { Row, Form, Button } from "react-bootstrap";
import DOMPurify from "dompurify";
import dateFormat from 'dateformat';
import { BrowserRouter as Router, useParams, } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import ProfilePic from "./ProfilePic";
import speech from "./speech.png";
import thumbup from "./thumbup.png";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function PostComment({ postId }) {
    var name = cookies.get("USER");
    const [body, setText] = useState("");
    const [showWarning, setWarning] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentData, setCommentData] = useState([]);
    const [likeData, setlikeData] = useState([]);
    const [hover, setHover] = useState(false);   

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/comment/${postId}`)
            .then((res) => setCommentData(res.data.comments))
            .catch(console.error);

        axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}`)
            .then((res) => setlikeData(res.data.posts))
            .catch(console.error);

    }, []);

    const onHover = () => {
      setHover(true);
    };
  
    const onLeave = () => {
      setHover(false);
    };

    const handleSubmit = (e) => {
        if (!name) {
            e.preventDefault();
            setWarning(true);
        } else {

            const configuration = {
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/comment/${postId}`,
                data: {
                    name,
                    postId,
                    body,
                },
            };
            // prevent the form from refreshing the whole page
            e.preventDefault();
            axios(configuration)
                .then((result) => {
                    axios.get(`${process.env.REACT_APP_API_URL}/comment/${postId}`)
                        .then((res) => setCommentData(res.data.comments))
                        .catch(console.error);
                })
                .catch((error) => {
                    error = new Error();
                    alert("Error");
                });
            setText("");
        }
    }

    const handleLike = (e) => {
        if (!name) {
            e.preventDefault();
            setWarning(true);
        } else {
            const configuration = {
                method: "put",
                url: `${process.env.REACT_APP_API_URL}/likepost/${postId}`,
                data: {
                    name
                },
            };
            // prevent the form from refreshing the whole page
            e.preventDefault();
            axios(configuration)
                .then((result) => {
                    axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}`)
                        .then((res) => setlikeData(res.data.posts))
                        .catch(console.error);
                })
                .catch((error) => {
                    error = new Error();
                    alert("Error");
                });
        }
    }

    const handleShow = (e) => {
        if (!showComments)
            setShowComments(true)
        else
            setShowComments(false)
    }


    if (showComments) {
        if (commentData) {
            return (
                <React.Fragment>
                    {showWarning && <p className='text-warning'>You must be signed in to comment</p>}
                    <div className="group-post-comment">
                        <div className="group-post-comment-form">
                            {!name && <a className='Post-text-info'>Post a comment</a>}
                            {name && <a className='Post-text-info'>Post a comment as {name}</a>}
                            <Form className='form-struct-post' onSubmit={(e) => handleSubmit(e)}>

                                {/* text */}
                                <Form.Group controlId="formBasictext">
                                    <textarea
                                        className='form-post-input-label-comment'
                                        type="textarea"
                                        name="text"
                                        value={body}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter text"
                                    />
                                </Form.Group>

                                {/* submit button */}
                                <Row className='button-bar'>

                                    <Button
                                        className='submit-button'
                                        variant="primary"
                                        type="submit"
                                        onClick={(e) => handleSubmit(e)}
                                    >Comment</Button>

                                </Row>
                            </Form>
                        </div>
                    </div>
                    <div className="comments">
                        <React.Fragment>
                            {commentData.map((comment) => (
                                <div className="group-post-comment">
                                    <ProfilePic userParam={comment.name} />
                                    <a href={"/profile/" + comment.name} className="Post-text-title">{comment.name} - {dateFormat(comment.date, "mmmm dS, yyyy")}</a >
                                    <article className="Post-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
                                </div>
                            ))}
                        </React.Fragment>
                    </div>

                    <Row>
                        <Button
                            className='show-more-row-wide'
                            variant="primary"
                            type="submit"
                            onClick={(e) => handleShow(e)}
                        >Hide Comments  <img className="comment-logo" src={speech} /></Button>
                        <Tooltip title={likeData.likes &&"Liked By: " + likeData.likes.toString()}>
                        <Button
                            className='show-more-row-like'
                            variant="primary"
                            type="submit"
                            onMouseEnter={onHover}
                            onMouseLeave={onLeave}
                            onClick={(e) => handleLike(e)}
                        >
                            {likeData.likes && <a> {likeData.likes.length} </a>}
                            <img className="comment-logo" src={thumbup} />
                        </Button>
                        </Tooltip>
                    </Row>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {showWarning && <p className='text-warning'>You must be signed in to comment</p>}
                <div className="group-post-comment">
                    <div className="group-post-comment-form">
                        {!name && <a className='Post-text-info'>Post a comment</a>}
                        {name && <a className='Post-text-info'>Post a comment as {name}</a>}
                        <Form className='form-struct-post' onSubmit={(e) => handleSubmit(e)}>

                            {/* text */}
                            <Form.Group controlId="formBasictext">
                                <textarea
                                    className='form-post-input-label-comment'
                                    type="textarea"
                                    name="text"
                                    value={body}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter text"
                                />
                            </Form.Group>

                            {/* submit button */}
                            <Row className='button-bar'>

                                <Button
                                    className='submit-button'
                                    variant="primary"
                                    type="submit"
                                    onClick={(e) => handleSubmit(e)}
                                >Comment</Button>

                            </Row>
                        </Form>
                    </div>
                </div>
                <Row>
                    <Button
                        className='show-more-row-wide'
                        variant="primary"
                        type="submit"
                        onClick={(e) => handleShow(e)}
                    >Hide Comments  <img className="comment-logo" src={speech} /></Button>
                    <Tooltip title={likeData.likes &&"Liked By: " + likeData.likes.toString()}>
                    <Button
                        className='show-more-row-like'
                        variant="primary"
                        type="submit"
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}
                        onClick={(e) => handleLike(e)}
                    >
                        {likeData.likes && <a> {likeData.likes.length} </a>}
                        <img className="comment-logo" src={thumbup} />
                    </Button>
                    </Tooltip>
                </Row>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <Row>
                    <Button
                        className='show-more-row'
                        variant="primary"
                        type="submit"
                        onClick={(e) => handleShow(e)}
                    >Comments  <img className="comment-logo" src={speech} /></Button>
                    <Tooltip title={likeData.likes &&"Liked By: " + likeData.likes.toString()}>
                    <Button
                        className='show-more-row-like'
                        variant="primary"
                        type="submit"
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}
                        onClick={(e) => handleLike(e)}
                    >
                        {likeData.likes && <a> {likeData.likes.length} </a>}
                        <img className="comment-logo" src={thumbup} />
                    </Button>
                    </Tooltip>
                </Row>
            </React.Fragment>
        )
    }
}