import React from 'react';
import { Slide, toast } from 'react-toastify';

const position = toast.POSITION.BOTTOM_RIGHT;

const ErrorMsg = ({ msg, toastProps }) => (
  <div>
    <p className="has-text-weight-bold">Une erreur s'est produite !</p>
    <p>{msg}</p>
  </div>
);

const SuccessMsg = ({ msg, toastProps }) => (
  <div>
    <p className="has-text-weight-bold">Confirmation</p>
    <p>{msg}</p>
  </div>
);

export default class ToastUtils {
  static showSuccess(message) {
    toast.success(<SuccessMsg msg={message} />, {
      position: position,
      autoClose: 5000,
      hideProgressBar: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      transition: Slide,
    });
  }

  static showError(message) {
    toast.error(<ErrorMsg msg={message} />, {
      position: position,
      autoClose: 5000,
      hideProgressBar: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      transition: Slide,
    });
  }

  static showDanger(message) {
    toast.warn(message, {
      position: position,
      autoClose: 5000,
      hideProgressBar: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      transition: Slide,
    });
  }

  static showInfo(message) {
    toast.info(message, {
      position: position,
      autoClose: 2500,
      hideProgressBar: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      transition: Slide,
    });
  }
}
