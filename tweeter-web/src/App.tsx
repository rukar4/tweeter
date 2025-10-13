import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation, } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/userPresenters/FolloweePresenter";
import { FollowerPresenter } from "./presenter/userPresenters/FollowerPresenter";
import { FeedPresenter } from "./presenter/statusPresenters/FeedPresenter";
import { StoryPresenter } from "./presenter/statusPresenters/StoryPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

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
          <ItemScroller
            key={ `feed-${ displayedUser!.alias }` }
            featurePath={ "/feed" }
            presenterFactory={ (view: PagedItemView<Status>) => new FeedPresenter(view) }
            itemFactory={
              (item: Status, featurePath: string) =>
                <StatusItem featurePath={ featurePath } status={ item }/>
            }
          />
        }/>
        <Route path="story/:displayedUser" element={
          <ItemScroller
            key={ `story-${ displayedUser!.alias }` }
            featurePath={ "/story" }
            presenterFactory={ (view: PagedItemView<Status>) => new StoryPresenter(view) }
            itemFactory={
              (item: Status, featurePath: string) =>
                <StatusItem featurePath={ featurePath } status={ item }/>
            }
          />
        }/>
        <Route path="followees/:displayedUser" element={
          <ItemScroller
            key={ `followees-${ displayedUser!.alias }` }
            featurePath={ "/followees" }
            presenterFactory={ (view: PagedItemView<User>) => new FolloweePresenter(view) }
            itemFactory={
              (item: User, featurePath: string) =>
                <UserItem featurePath={ featurePath } user={ item }/>
            }
          />
        }/>
        <Route path="followers/:displayedUser" element={
          <ItemScroller
            key={ `followers-${ displayedUser!.alias }` }
            featurePath={ "/followers" }
            presenterFactory={ (view: PagedItemView<User>) => new FollowerPresenter(view) }
            itemFactory={
              (item: User, featurePath: string) =>
                <UserItem featurePath={ featurePath } user={ item }/>
            }
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
      <Route path="/login" element={ <Login/> }/>
      <Route path="/register"
             element={ <Register/> }/>
      <Route path="*" element={
        <Login
          originalUrl={ location.pathname }
        />
      }/>
    </Routes>
  );
};

export default App;
