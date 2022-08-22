import { MoreVert } from '@mui/icons-material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./Post.css"
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
// import { Users } from "../../dummyData"


export default function Post({ post }) {
  //投稿のユーザーIDでユーザー情報をフィルタリング

  // const user = Users.filter((user) => user.id === post.id)[0]
  const [user, setUser] = useState({})
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/users?userId=${post.userId}`)
      setUser(response.data)
    }
    fetchUser()
  }, [post.userId]) //第二引数に空の配列を渡すと初期表示時のみレンダリング、変数を指定すると変数が更新されるたびにレンダリング

  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER

  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`} >
              <img src={user.profilePicture || PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="postProfileImg" />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className='postCenter'>
          <span className="postText">{post.desc}</span>
          <img src={PUBLIC_FOLDER + post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src={PUBLIC_FOLDER + "/heart.png"} alt="" className="likeIcon" onClick={() => handleLike()}/>
            <span className="postLikeCounter">
              {like}人がいいねを押しました
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post.comment}:コメント
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
