import React, { useContext, useRef } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/userPresenters/UserNavigationPresenter";

export const useUserInfo = () => {
  return useContext(UserInfoContext);
}

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
}

export const useUserNavigation = async (event: React.MouseEvent, featurePath: string) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();

  event.preventDefault();

  const view: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigateToFeature: (alias: string) => navigate(`${ featurePath }/${ alias }`),
    displayErrorMessage
  }

  const presenterRef = useRef<UserNavigationPresenter | null>(null)
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(view)
  }

  await presenterRef.current!.useUserNavigation(authToken!, event.target.toString(), displayedUser!)
}
