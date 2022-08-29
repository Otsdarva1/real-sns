import { createContext, useEffect, useReducer } from "react"
import AuthReducer from "./AuthReducer"

//最初のユーザー状態を定義
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
}

//状態をグローバルに管理する
export const AuthContext = createContext(initialState)
//createContextはグローバルなコンテキストを作り出すことができる

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user))
  }, [state.user])
  //useReducerは第一引数にreducerを、第二引数に初期値の状態を定義する
  //stateは新しい状態
  return(
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
  //childrenはvalueを使うことができるという意味。今回はAppにあたる
}