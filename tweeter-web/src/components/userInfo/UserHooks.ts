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

export const useUserNavigation = () => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    const view: UserNavigationView = {
      setDisplayedUser,
      navigateToFeature: (alias: string, featurePath: string) => navigate(`${ featurePath }/${alias}`),
      displayErrorMessage
    };
    presenterRef.current = new UserNavigationPresenter(view);
  }

  return async (event: React.MouseEvent, featurePath: string) => {
    event.preventDefault()
    await presenterRef.current!.useUserNavigation(
      authToken!,
      event.currentTarget.toString(),
      featurePath,
      displayedUser!
    )
  }
}
