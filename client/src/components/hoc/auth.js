import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../_actions/user_action';

export default function Auth(SpecificComponent, option, adminRoute = null) {
  // null = 모두 가능, true = logined user, false = not logined user
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(res => {
        if (!res.payload.isAuth) {
          if (option)
            props.history.push('/login');
        } else {
          if (adminRoute && !res.payload.isAdmin)
            props.history.push('/');
          else if (!option)
            props.history.push('/');
        }
      })
    }, );
    return (
      <SpecificComponent />
    );
  }
  return AuthenticationCheck;
}