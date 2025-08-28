import {createContext} from "react";

// 存放检查是否填写完毕的函数
export const SubmitCheckEmptyContext = createContext(null);
// 存放提交ref, 用于告知子组件是否需要检查
export const TendToSubmitContext = createContext(null);