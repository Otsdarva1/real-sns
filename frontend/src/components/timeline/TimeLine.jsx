import React, { useState } from 'react'
import { useEffect } from 'react';
import Post from '../post/Post'
import Share from '../share/Share'
import "./TimeLine.css"
// import { Posts } from "../../dummyData"
import axios from "axios"

export default function TimeLine({ username }) {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchPosts = async () => { //useEffect内でasync関数を作成する必要がある
      const response = username 
      ? await axios.get(`/posts/profile/${username}`)
      : await axios.get("/posts/timeline/62f36ecf6d36d2678027730a") //package.jsonのproxyの設定以降のパスを指定
      setPosts(response.data)
    }
    fetchPosts()
  }, [username]) //useEffectの第二引数に空の配列を設定すると一回だけ呼び出される

  return (
    <div className='timeline'>
      <div className="timelineWrapper">
        <Share />
        {posts.map((post) => (
          <Post post={post} key={post._id}/>
        ))}
      </div>
    </div>
  )
}
