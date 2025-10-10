import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation, } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { UserItemView } from "./presenter/userPresenters/UserItemPresenter";
import { FolloweePresenter } from "./presenter/userPresenters/FolloweePresenter";
import { FollowerPresenter } from "./presenter/userPresenters/FollowerPresenter";
import { StatusItemView } from "./presenter/statusPresenters/StatusItemPresenter";
import { FeedPresenter } from "./presenter/statusPresenters/FeedPresenter";
import { StoryPresenter } from "./presenter/statusPresenters/StoryPresenter";
import { LoginPresenter, LoginView } from "./presenter/AuthPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right"/>
      <BrowserRouter>
        { isAuthenticated() ? (
          <AuthenticatedRoutes/>
        ) : (
          <UnauthenticatedRoutes/>
        ) }
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={ <MainLayout/> }>
        <Route index element={ <Navigate to={ `/feed/${ displayedUser!.alias }` }/> }/>
        <Route path="feed/:displayedUser" element={
          <StatusItemScroller
            key={ `feed-${ displayedUser!.alias }` }
            featurePath={ "/feed" }
            presenterFactory={ (view: StatusItemView) => new FeedPresenter(view) }
          />
        }/>
        <Route path="story/:displayedUser" element={
          <StatusItemScroller
            key={ `story-${ displayedUser!.alias }` }
            featurePath={ "/story" }
            presenterFactory={ (view: StatusItemView) => new StoryPresenter(view) }
          />
        }/>
        <Route path="followees/:displayedUser" element={
          <UserItemScroller
            key={ `followees-${ displayedUser!.alias }` }
            featurePath={ "/followees" }
            presenterFactory={ (view: UserItemView) => new FolloweePresenter(view) }
          />
        }/>
        <Route path="followers/:displayedUser" element={
          <UserItemScroller
            key={ `followers-${ displayedUser!.alias }` }
            featurePath={ "/followers" }
            presenterFactory={ (view: UserItemView) => new FollowerPresenter(view) }
          />
        }/>
        <Route path="logout" element={ <Navigate to="/login"/> }/>
        <Route path="*" element={ <Navigate to={ `/feed/${ displayedUser!.alias }` }/> }/>
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={ <Login presenterFactory={ (view: LoginView) => new LoginPresenter(view) }/> }/>
      <Route path="/register" element={ <Register/> }/>
      <Route path="*" element={
        <Login
          presenterFactory={ (view: LoginView) => new LoginPresenter(view) }
          originalUrl={ location.pathname }
        />
      }/>
    </Routes>
  );
};

export default App;
