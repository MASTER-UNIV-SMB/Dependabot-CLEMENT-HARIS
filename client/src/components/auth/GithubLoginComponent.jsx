import React from 'react';
import GitHubLogin from 'react-github-login';
import axios from 'axios';
import ToastUtils from '../../utils/ToastUtils';
import UICardComponent from '../ui/UICardComponent';

export default function GithubLoginComponent(props) {
  const onSuccess = (github_response) => {
    if (github_response.code === undefined) return;

    axios
      .get('http://localhost:8080/api/v1/github/access-token?code=' + github_response.code)
      .then((response) => {
        const { data } = response;
        if (data.error) {
          ToastUtils.showError(data.message);
        } else {
          localStorage.setItem('access_token', data.data.access_token);
          props.onValidate();
        }
      })
      .catch((error) => {
        ToastUtils.showError(error.message);
      });
  };

  return (
    <UICardComponent>
      <GitHubLogin clientId="ef36b6e59bfe416d023a" scope={['repo', 'public_repo', 'read:user']} redirectUri="" onSuccess={onSuccess} onFailure={onSuccess} className={'github-login-button'} />
    </UICardComponent>
  );
}
