import React, { useState } from 'react'

import { firebaseApp } from 'lib/firebase'
import showNotification from 'lib/showNotification'

import { googleEvent } from 'components/page/GoogleAnalytics'

const LoginForm = ({ buttonText = 'Log in', thankyouText = 'Check your email for a login link!', googleEventAction = 'user_login', redirectTo, onCompleted }) => {
  const [inProgress, setInProgress] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [inputs, setInputs] = useState({ email: '' })
  const handleInputChange = ({ target }) => setInputs({ ...inputs, [target.name]: target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setInProgress(true)

    try {
      // Firebase login with just email link, no password
      const actionCodeSettings = {
        url: `${window.location.origin}/authenticate${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        handleCodeInApp: true
      }
      await firebaseApp.auth().sendSignInLinkToEmail(inputs.email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', inputs.email)
      handleInputChange({ target: { name: 'email', value: '' } })
      setIsSubmitted(true)
      if (googleEventAction) googleEvent(googleEventAction)
      if (onCompleted) onCompleted(null, inputs)
    } catch (error) {
      console.warn(error.message || error)
      showNotification(`Could not log in: ${error.message}`, 'error')
      if (onCompleted) onCompleted(error)
    } finally {
      setInProgress(false)
    }
  }

  return (
    <form className='login-form' onSubmit={handleSubmit}>
      {!isSubmitted ? (
        <>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            value={inputs.email}
            required
            placeholder='Your email'
            onChange={handleInputChange}
            disabled={inProgress}
          />
          <button
            type='submit'
            className={'progress-button' + (inProgress ? ' in-progress' : '')}
            disabled={inProgress}
          >
            {buttonText}
          </button>
        </>
      ) : (
        <p className='thankyou'>{thankyouText}</p>
      )}
    </form>
  )
}

export default LoginForm