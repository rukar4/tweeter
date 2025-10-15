import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMessageActions } from "../toaster/MessageHooks";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface OAuthBtnProps {
  title: string
  icon: IconProp
}

const OAuthBtns = (props: OAuthBtnProps) => {
  const { displayInfoMessage } = useMessageActions();
  const tooltip = `${props.title}-tooltip`

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(
      message,
      3000,
      "text-white bg-primary"
    )
  }
  return (
  <button
    type="button"
    className="btn btn-link btn-floating mx-1"
    onClick={ () =>
      displayInfoMessageWithDarkBackground(
        `${props.title} registration is not implemented.`
      )
    }
  >
    <OverlayTrigger
      placement="top"
      overlay={ <Tooltip id={ tooltip }>{ props.title }</Tooltip> }
    >
      <FontAwesomeIcon icon={ props.icon }/>
    </OverlayTrigger>
  </button>
  )
}

const OAuth = () => {
  return (
    <div className="text-center mb-3">
      <OAuthBtns title={'Google'} icon={["fab", "google"]}/>
      <OAuthBtns title={'Facebook'} icon={["fab", "facebook"]}/>
      <OAuthBtns title={'Twitter'} icon={["fab", "twitter"]}/>
      <OAuthBtns title={'LikedIn'} icon={["fab", "linkedin"]}/>
      <OAuthBtns title={'Github'} icon={["fab", "github"]}/>
    </div>
  )
}

export default OAuth;