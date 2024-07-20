import React, { useState } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import Redirect from 'helpers/redirect';
import { Reference, ReferenceLink } from 'helpers/reference';
import { useAccount } from 'frontastic';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';

export interface RegisterProps {
  logo?: NextFrontasticImage;
  loginLink?: Reference;
}

const Register: React.FC<RegisterProps> = ({ logo, loginLink }) => {
  //i18n messages
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage: formatSuccessMessage } = useFormat({ name: 'success' });
  const { formatMessage } = useFormat({ name: 'common' });

  //account actions
  const { register, loggedIn, update } = useAccount();
 
  //register data
  const [data, setData] = useState({email: '', password: '', confirmPassword: '' });

  //error
  const [error, setError] = useState('');

  //success
  const [success, setSuccess] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //token
  const [token, setToken] = useState();

  //handle text input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };



  //data validation
  const validate = () => {
    //validation schema
    const passwordsMatch = data.password === data.confirmPassword;

    //UI error messages
    if (!passwordsMatch)
      setError(formatErrorMessage({ id: 'password.noMatch', defaultMessage: "Passwords don't match" }));

    //return a boolean representing the data validity
    return passwordsMatch;
  };

  //form submission
  

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   //validate data
  //   if (!validate()) return;
  //   //processing starts
  //   setLoading(true);
  //   //try registering the user with given credentials
  //   try {
  //     const response = await register({ email: data.email, password: data.password });
  //     if (!response.accountId) {
  //       setError(
  //         formatErrorMessage({ id: 'account.create.fail', defaultMessage: "Sorry. We couldn't create your account.." }),
  //       );
  //       setSuccess('');
  //     } else {
  //       setError('');
  //       setSuccess(
  //         formatSuccessMessage({
  //           id: 'account.created',
  //           defaultMessage: 'A verification email was sent to {email} ✓',
  //           values: { email: data.email },
  //         }),
  //       );
  //     }
  //   } catch (err) {
  //     setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
  //     setSuccess('');
  //   }
  //   //processing ends
  //   setLoading(false);
  // };

  if (loggedIn) return <Redirect target="/" />;

  // Verification Email code
  const handleVerifyEmail = async (tokenValue: any) => {
    // const verificationToken = tokenValue?.value
        console.log("Token Value email: " , tokenValue?.value)
    try {
      const response = await fetch(`https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/customers/email/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({tokenValue: tokenValue?.value}),
      });

      if (!response.ok) {
        throw new Error('Failed to verify email');
      }
// console.log("EmailConfirm : ", JSON.stringify({ tokenValue }))
      // Handle success response here, e.g., show a success message
    } catch (error) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
      setSuccess('');
    }
  };

const getToken = async () => {
  const url = "https://auth.us-central1.gcp.commercetools.com/oauth/token?grant_type=client_credentials";
  const auth = "Basic dkZuR1E2eXZmbW1iQXBYWWxPQ2NDNVkzOlRQaVJjWXVJLXZ6MzhwUGpqTWpkckhraG5XWWN1OWkx";

  const myHeaders = new Headers();
  myHeaders.append("Authorization", auth);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    RequestRedirect: "follow"
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }
    const data = await response.json();
    const token = data.access_token;
    
    setToken(token)
    return token;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
// Call the getToken function to retrieve the token
getToken();
// console.log("Token:", token);

  // if data saved successfully form will clean


//Handle submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    const response = await register({ email: data.email, password: data.password });
    if (!response.accountId) {
      setError(formatErrorMessage({ id: 'account.create.fail', defaultMessage: "Sorry. We couldn't create your account.." }));
      setSuccess('');
    } else {
      setError('');
      setSuccess(
        formatSuccessMessage({
          id: 'account.created',
          defaultMessage: 'A verification email was sent to {email} ✓',
          values: { email: data.email },
        }),
      );

      // Call the endpoint to create a token for email verification
      const token = localStorage.getItem('BearerToken');
      const tokenResponse = await fetch(`https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/customers/email-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: response.accountId, ttlMinutes: 4320 }), // Assuming response.accountId is the customerId
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to create email verification token');
      }

      const tokenValue = await tokenResponse.json();
      console.log("Token Value: ", tokenValue.value);
      await handleVerifyEmail(tokenValue);

      // Clear form after successful submission
      setData({ email: '', password: '', confirmPassword: ''});
    }
window.location.reload();
  } catch (err) {
    setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    setSuccess('');
  }

  setLoading(false);
};


  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative h-12 dark:invert">
            <Image {...logo} alt="Logo" layout="fill" objectFit="contain" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-light-100">
            {formatAccountMessage({ id: 'account.create.new', defaultMessage: 'Create a new account' })}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {formatAccountMessage({ id: 'account.alreadyHave', defaultMessage: 'Already have an account?' })}{' '}
            <ReferenceLink target={loginLink} className="font-medium text-accent-400 underline hover:text-accent-500">
              {formatAccountMessage({ id: 'account.login.here', defaultMessage: 'Login here' })}
            </ReferenceLink>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow dark:bg-primary-200 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {success && <p className="text-sm text-green-600" dangerouslySetInnerHTML={{ __html: success }}></p>}
              {error && <p className="text-sm text-accent-400">{error}</p>}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-light-100">
                  {formatMessage({ id: 'emailAddress', defaultMessage: 'Email Address' })}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 shadow-sm placeholder:text-gray-400 focus:border-accent-400 focus:outline-none focus:ring-accent-400 sm:text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-light-100">
                  {formatAccountMessage({ id: 'password', defaultMessage: 'Password' })}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 shadow-sm placeholder:text-gray-400 focus:border-accent-400 focus:outline-none focus:ring-accent-400 sm:text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-light-100"
                >
                  {formatAccountMessage({ id: 'password.confirm', defaultMessage: 'Confirm Password' })}
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 shadow-sm placeholder:text-gray-400 focus:border-accent-400 focus:outline-none focus:ring-accent-400 sm:text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-accent-400 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 ease-out hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-200"
                  disabled={loading}
                >
                  {formatAccountMessage({ id: 'sign.up', defaultMessage: 'Sign up' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
