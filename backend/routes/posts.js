const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User")


//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    return res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//投稿を更新する
router.put("/:id", async (req, res) => { //id...投稿のid
  const postId = req.params.id
  const userId = req.body.userId
  try {
    const post = await Post.findById(postId)
    if (post.userId === userId) {
      //投稿のユーザーidとリクエストのユーザーidが一致した時だけ投稿内容を更新できる
      await post.updateOne({
        $set: req.body,
      })
      return res.status(200).json("投稿編集に成功しました")
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません")
    }
  } catch (err) {
    return res.status(403).json(err)
  }
})

//投稿を削除する
router.delete("/:id", async (req, res) => {
  const postId = req.params.id
  const userId = req.body.userId
  try {
    const post = await Post.findById(postId)
    if (post.userId === userId) {
      await post.deleteOne()
      return res.status(200).json("投稿削除に成功しました")
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません")
    }
  } catch (err) {
    return res.status(403).json(err)
  }
})

//投稿を取得する
router.get("/:id", async (req, res) => {
  const postId = req.params.id
  const userId = req.body.userId
  try {
    const post = await Post.findById(postId)
    return res.status(200).json(post)
  } catch (err) {
    return res.status(403).json(err)
  }
})

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  const tarPostId = req.params.id
  const userId = req.body.userId
  try {
    const tarPost = await Post.findById(tarPostId)
    if (!tarPost.likes.includes(userId)) {
      //まだ投稿にいいねが押されていなかったらいいねする（ユーザーIDを追加する）
      await tarPost.updateOne({
        $push: { //配列にpushする
          likes: userId,
        },
      })
      return res.status(200).json("投稿にいいねを押しました")
    } else {
      //投稿にすでにいいねが押されていたらいいねを外す（ユーザーIDを取り除く）
      await tarPost.updateOne({
        $pull: {
          likes: userId,
        },
      })
      return res.status(200).json("投稿にいいねを外しました")
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

//プロフィールのタイムラインの取得（自分の投稿のみ）
router.get("/profile/:username", async(req, res) => {
  try {
    const tarUser = await User.findOne({ username: req.params.username })
    const userPosts = await Post.find({ userId: tarUser._id }) //ターゲットユーザー自身の投稿内容を取得
    return res.status(200).json(userPosts)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//タイムラインの投稿を取得する
router.get("/timeline/:userId", async(req, res) => {
  const tarUserId = req.params.userId
  try {
    const tarUser = await User.findById(tarUserId)
    const userPosts = await Post.find({ userId: tarUser._id }) //ターゲットユーザー自身の投稿内容を取得
    const followingsPosts = await Promise.all( //ターゲットユーザーがフォローしている全てのユーザーの投稿内容を全て取得する
    tarUser.followings.map((followingId) => {
        return Post.find({ userId: followingId })
      })
    )
    return res.status(200).json(userPosts.concat(...followingsPosts))
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router;