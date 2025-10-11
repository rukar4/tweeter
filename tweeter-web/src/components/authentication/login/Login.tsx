import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginPresenter, LoginView } from "../../../presenter/authPresenters/LoginPresenter";

interface Props {
  originalUrl?: string
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage, displayInfoMessage } = useMessageActions();

  const view: LoginView = {
    setIsLoading: setIsLoading,
    updateUserInfo: updateUserInfo,
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    navigateToOriginal: (url: string) => navigate(url),
    navigateToFeed: (alias: string) => navigate(`/feed/${ alias }`)
  }
  
  const presenterRef = useRef<LoginPresenter | null>(null)
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(view)
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      login();
    }
  };

  const login = async () => {
    await presenterRef.current!.login(alias, password, rememberMe, props.originalUrl)
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        onEnter={ loginOnEnter }
        alias={ alias }
        password={ password }
        setAlias={ setAlias }
        setPassword={ setPassword }
        isBottom={ true }
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={ inputFieldFactory }
      switchAuthenticationMethodFactory={ switchAuthenticationMethodFactory }
      setRememberMe={ setRememberMe }
      submitButtonDisabled={ checkSubmitButtonStatus }
      isLoading={ isLoading }
      submit={ login }
    />
  );
};

export default Login;
