import React, {lazy, Suspense, useContext, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import refreshAlert from "./utils/refreshAlert";
// 路由懒加载
const Login = lazy(() => import('./pages/login'));
const Background = lazy(() => import('./pages/main_nav_pages/background'));
const Entire = lazy(() => import('./pages/main_nav_pages/entire'));

const Home = lazy(() => import('./pages/main_nav_pages/home'));
const Edit = lazy(() => import('./pages/main_nav_pages/nav_pages/edit'));
const Published = lazy(() => import('./pages/main_nav_pages/nav_pages/published'));

const Draft = lazy(() => import('./pages/main_nav_pages/nav_pages/drafts/draft'));
const DraftDisplay = lazy(() => import('./pages/main_nav_pages/nav_pages/drafts/draftDisplay'));
const DraftPreview = lazy(() => import('./pages/main_nav_pages/nav_pages/drafts/draftPreview'));


const Involved = lazy(() => import('./pages/main_nav_pages/nav_pages/involved/involved'));
const CheckInvolvedDetails = lazy(() => import('./pages/main_nav_pages/nav_pages/involved/checkInvolvedDetails'));
const InvolvedDisplay = lazy(() => import('./pages/main_nav_pages/nav_pages/involved/involvedDisplay'));

const Profile = lazy(() => import('./pages/main_nav_pages/nav_pages/profile'));
const Setting = lazy(() => import('./pages/main_nav_pages/nav_pages/setting'));
const CheckSurvey = lazy(() => import('./pages/check_fill_survey/checkSurvey'));

const Error = lazy(() => import('./pages/errors/error'));
const NotFoundPage = lazy(() => import('./pages/errors/notFoundPage'));

const App = () => {

	useEffect(() => {
		// 刷新警告
		document.addEventListener('keydown', refreshAlert);

		return () => {
			document.removeEventListener('keydown', refreshAlert);
		}
	}, []);


	return (
		<div>
			<Router>
				<Suspense fallback={<div>loading...</div>}>
					<Routes>
						<Route element={<Login/>}>

							<Route path='/' element={<Background/>}>
								<Route index element={<Home/>}/>

								<Route path='platform' element={<Entire/>}>

									<Route path='edit' element={<Edit/>}/>

									<Route path='published' element={<Published/>}>
										<Route path=':ended' element={<Published/>}/>
									</Route>

									<Route path='draft' element={<Draft/>}>
										<Route index element={<DraftDisplay/>}/>
										<Route path='preview' element={<DraftPreview/>}/>
									</Route>

									<Route path='involved' element={<Involved/>}>
										<Route index element={<InvolvedDisplay/>}/>
										<Route path='check/:answerId' element={<CheckInvolvedDetails/>}/>
									</Route>

									<Route path='survey/:surveyId' element={<CheckSurvey/>}></Route>
								</Route>

								<Route path='profile' element={<Profile/>}/>
								<Route path='setting' element={<Setting/>}/>

							</Route>

							<Route path='/error' element={<Error/>}/>
							<Route path='*' element={<NotFoundPage/>}/>
						</Route>
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
};

export default App;
