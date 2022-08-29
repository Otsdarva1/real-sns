import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import Post from '../post/Post'
import Share from '../share/Share'
import "./TimeLine.css"
// import { Posts } from "../../dummyData"
import axios from "axios"
import { AuthContext } from '../../state/AuthContext'

export default function TimeLine({ username }) {
  const [posts, setPosts] = useState([])
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchPosts = async () => { //useEffect内でasync関数を作成する必要がある
      const response = username
        ? await axios.get(`/posts/profile/${username}`) //プロフィールの場合
        : await axios.get(`/posts/timeline/${user._id}`) //ホームの場合
      setPosts(response.data.sort((post1, post2) => {
        return new Date(post2.createdAt) - new Date(post1.createdAt)
      }))
    }
    fetchPosts()
  }, [username, user._id]) //useEffectの第二引数に空の配列を設定すると一回だけ呼び出される.設定するとそれぞれの値が更新されたタイミングで発火する

  return (
    <div className='timeline'>
      <div className="timelineWrapper">
        <Share />
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </div>
  )
}
