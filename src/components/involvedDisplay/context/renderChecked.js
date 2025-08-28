import {createContext} from "react";


// 存放answers中对于各题的回答, index++sorted
export const AnswersDetailsContext = createContext(null);
// 存放每个answer对应的questionDetail, index++sorted
export const QuesDetailsBoundedContext = createContext(null);
// Answer对应的survey概述
export const SurveyOverviewContext = createContext(null);