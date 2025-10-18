import React from "react";

interface Props {
  onEnter: (event: React.KeyboardEvent<HTMLElement>) => void
  alias: string
  password: string
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  isBottom?: boolean
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={ 50 }
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          value={ props.alias }
          onKeyDown={ props.onEnter }
          onChange={ (event) => props.setAlias(event.target.value) }
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className={ props.isBottom ? "form-floating mb-3" : "form-floating" }>
        <input
          type="password"
          className={ props.isBottom ? "form-control bottom" : "form-control" }
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          value={ props.password }
          onKeyDown={ props.onEnter }
          onChange={ (event) => props.setPassword(event.target.value) }
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  )
}

export default AuthenticationFields