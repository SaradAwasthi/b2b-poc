import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import Loader from 'components/commercetools-ui/loader';
import { useFormat } from 'helpers/hooks/useFormat';
import Redirect from 'helpers/redirect';
import { Reference, ReferenceLink } from 'helpers/reference';
import { useAccount } from 'frontastic';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import axios from 'axios';

export interface LoginProps {
  registerLink?: Reference;
  accountLink?: Reference;
  signupLink?: Reference;
}

const Login: React.FC<LoginProps> = ({ registerLink, accountLink }) => {
  //i18n messages
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage } = useFormat({ name: 'common' });
  const router = useRouter();
  //account actions
  const { login, loggedIn, requestConfirmationEmail, requestPasswordReset } = useAccount();

  //login data
  const [data, setData] = useState({ email: '', password: '', rememberMe: false });

  //error
  const [error, setError] = useState('');

  //success
  const [success, setSuccess] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //attempting to resend verification email
  const [resendVerification, setResendVerification] = useState(false);

  //attempting to request a password reset
  const [resendPasswordReset, setResendPasswordReset] = useState(false);

  //not on default login modal
  const subModal = resendVerification || resendPasswordReset;

  //Password is visible while typing
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //Toggles password visibility
  const togglePasswordVisibility = useCallback(() => setIsPasswordVisible(!isPasswordVisible), [isPasswordVisible]);

  //get back to login modal
  const backToLogin = () => {
    setSuccess('');
    setError('');
    setResendPasswordReset(false);
    setResendVerification(false);
  };

  //wants to resend verification
  const toResendVerification = () => {
    setResendVerification(true);
    setResendPasswordReset(false);
  };

  //requesting a password reset
  const toResendPassword = () => {
    setError('');
    setSuccess('');
    setResendPasswordReset(true);
    setResendVerification(false);
  };

  const handleSignUpPage = () => { };

  //handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //handle checkbox input change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  //login user
  const loginUser = async () => {
    try {
      const response = await login(data.email, data.password, data.rememberMe);
      if (!response.accountId)
        setError(formatErrorMessage({ id: 'auth.wrong', defaultMessage: 'Wrong email address or password' }));
      else if (!!response.confirmed) {
        //setError(formatErrorMessage({ id: 'auth.wrong', defaultMessage: 'Wrong email address or password' }));
        axios
          .post(
            `${process.env.commercetools_authUrl}/oauth/${process.env.commercetools_projectKey}/customers/token?grant_type=password&username=${data.email}&password=${data.password}`,
            {},
            {
              headers: {
                Authorization: 'Basic dkZuR1E2eXZmbW1iQXBYWWxPQ2NDNVkzOlRQaVJjWXVJLXZ6MzhwUGpqTWpkckhraG5XWWN1OWkx',
              },
            },
          )
          .then((res) => {
            localStorage.setItem('BearerToken', res.data.access_token);
            window.location.reload();
          });
      }
      // else if(response.accountId){
      //   Jwt.sign({ response }, (err, token) => {
      //     if(err){
      //       console.log("sumething went wrong");
      //     }
      //     console.log({ auth: token});
      //   })
      // }
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    }
  };

  //resend verification email for user
  const resendVerificationEmailForUser = async () => {
    try {
      await requestConfirmationEmail(data.email, data.password);
      setSuccess(
        formatAccountMessage({
          id: 'verification.resent',
          defaultMessage: 'An email was sent to {email}',
          values: { email: data.email },
        }),
      );
      setLoading(false);
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
      setLoading(false);
    }
  };

  //request a password reset for user
  // const resendPasswordResetForUser = async () => {
  //   try {
  //     const response = await requestPasswordReset(data.email);
  //     if (response.ok === false) {
  //       setSuccess('');
  //       setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
  //     } else {
  //       setError('');
  //       setSuccess(
  //         formatAccountMessage({
  //           id: 'verification.resent',
  //           defaultMessage: 'An email was sent to {email}',
  //           values: { email: data.email },
  //         }),
  //       );
  //     }
  //     setLoading(false);
  //   } catch (err) {
  //     setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
  //     setLoading(false);
  //   }
  // };

  //form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    //processing starts
    //if user is attempting to resend verification email
    if (resendVerification) resendVerificationEmailForUser();
    //if user is attempting tor equest a password reset

    // else if (resendPasswordReset) resendPasswordResetForUser();

    //if user wants to login
    else loginUser();
    //processing ends
  };

  if (loggedIn) {
    // router.push(Object.keys(router.query)[0]);
    if (Object.keys(router.query)[0] === 'slug' || Object.keys(router.query)[0] === 'path') {
      router.push('/');
    } else {
      router.push(Object.keys(router.query)[0]);
    }
    //<Redirect target='/' />
  }

  return (
    <>

      <div className="">
        <div className="">
          <div className="login flex flex-col justify-center items-center mx-auto max-w-[520px] py-12 p-6 bg-rc-brand-primary rounded flex-shrink-0 rounded-lg border-[1px] border-gray-900">
            <div className='mt-5 ml-5 text-white'>{loading && <Loader />}</div>

            <form className="space-y-3 flex flex-col w-full" onSubmit={handleSubmit}>
              <div className="pt-4 text-center">
                {/* <h2 className="login-message text-2xl font-bold">
                  {resendPasswordReset ? (
                    <>
                      {formatAccountMessage({ id: 'password.reset.headline', defaultMessage: 'Reset your password' })}
                      <p className="pw-reset-subheading">
                        {formatAccountMessage({
                          id: 'password.reset.subheadline',
                          defaultMessage:
                            'Please enter the email registered with Nerivio, and we will send your a reset link',
                        })}
                      </p>
                    </>
                  ) : (
                    <>
                      {formatAccountMessage({ id: 'account.sign.in', defaultMessage: 'Sign in to' })}
                      <span className="login-nerivio ml-2">Nerivio</span>
                    </>
                  )}
                </h2> */}
                {/* {!subModal && (
                  <h3 className="text-md login-signup-message mt-6">
                    {formatAccountMessage({ id: 'login-details', defaultMessage: 'New to RC?' })}{' '}
                    <span className="login-signup font-bold" onClick={handleSignUpPage}>
                      <ReferenceLink target={registerLink} className="login-terms font-medium underline">
                        {formatAccountMessage({ id: 'sign.up', defaultMessage: 'Sign-up now' })}
                      </ReferenceLink>{' '}
                    </span>
                  </h3>
                )} */}
              </div>
              {success && <p className="whitespace-nowrap text-sm text-green-600">{success}</p>}
              {error && <p className="text-accent-400 text-sm">{error}</p>}
              <div className='mx-4'>
                <label htmlFor="email" className="text-white block text-sm font-medium">
                  {formatMessage({ id: 'email', defaultMessage: 'Email' })}
                </label>
                <div className="relative mt-1 text-white">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={formatAccountMessage({ id: 'email.enter', defaultMessage: 'Enter your email' })}
                    required
                    className="placeholder:text-white-700 text-black block w-full appearance-none rounded-sm border border-gray-300 px-3 py-4 shadow-sm focus:outline-none sm:text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {!resendPasswordReset && (
                <div className='mx-4'>
                  <label htmlFor="password" className="text-white block text-sm font-medium">
                    {formatAccountMessage({ id: 'password', defaultMessage: 'Password' })}
                  </label>
                  <div className="relative mt-1 text-white">
                    <input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      required
                      className="placeholder:text-white-700 text-black block w-full appearance-none rounded-sm border border-gray-300 px-3 py-4 shadow-sm focus:outline-none sm:text-sm"
                      onChange={handleChange}
                    />
                    <span
                      className="absolute right-3 top-1/2 block h-4 w-4 -translate-y-1/2 text-neutral-600"
                      onClick={togglePasswordVisibility}
                    >
                      {!isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </span>
                  </div>
                </div>
              )}

              {!subModal && (
                <div className="mt-2 space-y-2 mx-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        className="focus:ring-accent-500 h-5 w-5 rounded-sm border-gray-300 text-transparent"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="remember-me" className="text-white ml-2 block whitespace-nowrap text-sm">
                        {formatMessage({ id: 'rememberMe', defaultMessage: 'Remember me' })}
                      </label>
                    </div>

                    {/* <div className="text-right text-sm">
                      <span
                        className="login-forget hover:text-accent-400 cursor-pointer underline transition"
                        onClick={toResendPassword}
                      >
                        {formatAccountMessage({ id: 'password.forgot', defaultMessage: 'Forgot your password?' })}
                      </span>
                    </div> */}
                  </div>

                  {/* <div className="flex items-center justify-end">
                    <div className="text-sm">
                      <span
                        className="cursor-pointer font-medium text-accent-400 hover:text-accent-500"
                        onClick={toResendVerification}
                      >
                        {formatAccountMessage({
                          id: 'verification.resend',
                          defaultMessage: 'Bestätigungsmail erneut senden',
                        })}
                      </span>
                    </div>
                  </div> */}
                </div>
              )}
              <div>
                <div className='w-full flex justify-center'>
                  <button
                    type="submit"
                    className="w-fit px-6 py-2 focus:ring-accent-400 flex w-full justify-center rounded-md border border-gray-900 text-lg font-bold text-white shadow-sm transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-200"
                  >
                    {subModal
                      ? formatMessage({ id: 'get.reset.link', defaultMessage: 'Get Reset Link' })
                      : formatAccountMessage({ id: 'sign.in', defaultMessage: 'Sign in' })}
                  </button>
                </div>
                {subModal ? (
                  <>
                    <div className="flex justify-end">
                      <button className="back-to-login-btn" onClick={backToLogin}>
                        {formatAccountMessage({ id: 'back.sign.in', defaultMessage: 'Back To Sign-In' })}
                      </button>
                    </div>
                    <h1 className="pw-reset-register-heading">
                      {formatAccountMessage({ id: 'new.here', defaultMessage: 'I am new here' })}
                    </h1>
                    <Link href={'/register'}>
                      <button className="pw-reset-register-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                          <path
                            d="M19.9376 20V20.5H20.9376V20H19.9376ZM16.4532 14.3333V13.8333V14.3333ZM8.48448 14.3333V13.8333V14.3333ZM4.50011 18.1111H4.00011H4.50011ZM4.00011 20C4.00011 20.2761 4.22396 20.5 4.50011 20.5C4.77625 20.5 5.00011 20.2761 5.00011 20H4.00011ZM20.9376 20V18.1111H19.9376V20H20.9376ZM20.9376 18.1111C20.9376 17.5731 20.8713 16.9362 20.7011 16.331C20.5327 15.7319 20.25 15.1192 19.7855 14.6788L19.0975 15.4045C19.3803 15.6726 19.5956 16.0935 19.7384 16.6016C19.8795 17.1035 19.9376 17.6471 19.9376 18.1111H20.9376ZM19.7855 14.6788C19.3131 14.2308 18.7221 14.0264 18.1471 13.9288C17.5767 13.832 16.9732 13.8333 16.4532 13.8333V14.8333C16.99 14.8333 17.5071 14.8345 17.9798 14.9147C18.4479 14.9942 18.8227 15.1439 19.0975 15.4045L19.7855 14.6788ZM16.4532 13.8333H8.48448V14.8333H16.4532V13.8333ZM8.48448 13.8333C7.96256 13.8333 7.30214 13.8323 6.67481 13.9274C6.05524 14.0214 5.38757 14.2195 4.90316 14.6788L5.5912 15.4045C5.854 15.1553 6.27662 14.9992 6.82472 14.9161C7.36505 14.8342 7.94968 14.8333 8.48448 14.8333V13.8333ZM4.90316 14.6788C4.4146 15.142 4.20119 15.7855 4.1004 16.3831C3.99891 16.9849 4.00011 17.6172 4.00011 18.1111H5.00011C5.00011 17.603 5.00123 17.0548 5.08647 16.5495C5.17241 16.0399 5.33254 15.6497 5.5912 15.4045L4.90316 14.6788ZM4.00011 18.1111V20H5.00011V18.1111H4.00011ZM15.9532 6.77773C15.9532 8.56325 14.4186 10.0555 12.4689 10.0555V11.0555C14.9201 11.0555 16.9532 9.16503 16.9532 6.77773H15.9532ZM12.4689 10.0555C10.5191 10.0555 8.98448 8.56325 8.98448 6.77773H7.98448C7.98448 9.16503 10.0176 11.0555 12.4689 11.0555V10.0555ZM8.98448 6.77773C8.98448 4.99222 10.5191 3.49995 12.4689 3.49995V2.49995C10.0176 2.49995 7.98448 4.39043 7.98448 6.77773H8.98448ZM12.4689 3.49995C14.4186 3.49995 15.9532 4.99222 15.9532 6.77773H16.9532C16.9532 4.39043 14.9201 2.49995 12.4689 2.49995V3.49995Z"
                            fill="black"
                          />
                        </svg>
                        {formatAccountMessage({ id: 'register', defaultMessage: 'Register' })}
                      </button>
                    </Link>
                  </>
                ) : (
                  <p className="mt-4 mb-5 text-center text-sm text-white">
                    {formatAccountMessage({ id: 'login-terms', defaultMessage: 'By continuing, you agree to our' })}{' '}
                    <Link href="/terms-of-use">
                      <a className="login-terms mx-2 underline">
                        {formatAccountMessage({ id: 'login.terms', defaultMessage: 'Terms of Use' })}
                      </a>
                    </Link>{' '}
                    <span>{formatAccountMessage({ id: 'and', defaultMessage: '&' })}</span>{' '}
                    <Link href="/privacy-policy">
                      <a className="login-terms ml-2 underline">
                        {formatAccountMessage({ id: 'login.policy', defaultMessage: 'Privacy Policy' })}
                      </a>
                    </Link>
                  </p>
                )}

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
