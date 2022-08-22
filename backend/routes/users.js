const router = require("express").Router();
const User = require("../models/User")

//CRUD
//ユーザー情報の更新
router.put("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, // $set...スキーマに定義されている項目全てをセットする
      })
      res.status(200).json("ユーザー情報が更新されました")
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます")
  }
})

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("ユーザー情報が削除されました")
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます")
  }
})

//ユーザー情報の取得
// router.get("/:id", async(req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//     const { password, updatedAt, ...other } = user._doc
//     return res.status(200).json(other)
//   } catch (err) {
//     return res.status(500).json(err)
//   }
// })

//クエリでユーザー情報を取得
router.get("/", async(req, res) => {
  const userId = req.query.userId
  const username = req.query.username
  try {
    const user = userId ? await User.findById(userId) : await User.findOne({ username: username })
    const { password, updatedAt, ...other } = user._doc
    return res.status(200).json(other)
  } catch (err) {
    return res.status(500).json(err)
  }
})


//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  const tarUserId = req.params.id
  const userId = req.body.userId
  if(userId !== tarUserId) { //req.body.userIdは自分のid、req.params.idはこれからフォローするid
    //相手ユーザーが自分ではなかったらフォローできる
    try {
      const tarUser = await User.findById(tarUserId)
      const user = await User.findById(userId)
      if(!tarUser.followers.includes(userId)) {
        //相手ユーザーのフォロワーに自分が含まれていなかったらフォローできる
        await tarUser.updateOne({
          $push: { //配列にpushする
            followers: userId,
          },
        })
        await user.updateOne({
          $push: {
            followings: tarUserId,
          },
        })
        return res.status(200).json("フォローに成功しました")
      } else {
        return res.status(403).json("あなたはすでにこのユーザーをフォローしています")
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json("自分自身をフォローできません")
  }
})

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  const tarUserId = req.params.id
  const userId = req.body.userId
  if(userId !== tarUserId) {
    try {
      const tarUser = await User.findById(tarUserId)
      const user = await User.findById(userId)
      if(tarUser.followers.includes(userId)) {
        //相手ユーザーのフォロワーに自分が含まれていたらフォローを外せる
        await tarUser.updateOne({
          $pull: { //配列からpullする（取り出す）
            followers: userId,
          },
        })
        await user.updateOne({
          $pull: {
            followings: tarUserId,
          },
        })
        return res.status(200).json("フォロー解除しました")
      } else {
        return res.status(403).json("フォローしていないので解除できません")
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません")
  }
}) 

module.exports = router;