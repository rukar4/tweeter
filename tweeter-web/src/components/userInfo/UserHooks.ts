import React, { MouseEventHandler, useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";

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

  try {
    const alias = extractAlias(event.target.toString());

    const toUser = await getUser(authToken!, alias);

    if (toUser) {
      if (!toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${ featurePath }/${ toUser.alias }`);
      }
    }
  } catch (error) {
    displayErrorMessage(
      `Failed to get user because of exception: ${ error }`
    );
  }
}

const extractAlias = (value: string): string => {
  const index = value.indexOf("@");
  return value.substring(index);
};

const getUser = async (
  authToken: AuthToken,
  alias: string
): Promise<User | null> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.findUserByAlias(alias);
};